const express = require("express");
const morgan = require("morgan");
const { exec } = require("child_process");

// bcrypt
const bcrypt = require("bcrypt");

// sql
const mysql = require("mysql");

// express app
const app = express();
const connection = mysql.createConnection({
  host: "bigdata-assignment2.cyyydukauqnv.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "bigdatardsmysql",
  port: "3306",
  database: "supermarket",
});

// register view engine
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(express.json());

app.listen(3000); // localhost:3000

const crypto = require("crypto");
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const secretKey = generateSecretKey();

const session = require("express-session");
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// handle login form submissions **validate logins against db here**
app.post("/login-form", async (request, response) => {
  const formData = request.body; // email/password from login form

  connection.query(
    "SELECT * FROM `Account` WHERE `email` = ?",
    [formData.email],
    async function (error, authResults) {
      if (error) throw error;

      const match = await bcrypt.compare(
        formData.password,
        authResults[0].password
      );

      if (!match) {
        response.redirect("/login");
      } else if (authResults[0].UserType == "Customer") {
        connection.query(
          "SELECT * FROM `Customer` WHERE `Email` = ?",
          [formData.email],
          function (error, customerResults) {
            if (error) throw error;

            request.session.user = {
              customerId: customerResults[0].CustomerID,
              name: customerResults[0].Name,
              email: customerResults[0].Email,
              type: authResults[0].UserType,
              address: customerResults[0].Address,
              phone: customerResults[0].PhoneNo,
            };
            response.redirect("/" + authResults[0].UserType);
          }
        );
      } else if (authResults[0].UserType == "Staff") {
        connection.query(
          "SELECT * FROM `Staff` WHERE `email` = ?",
          [formData.email],
          function (error, staffResults) {
            if (error) throw error;

            request.session.user = {
              staffId: staffResults[0].Staff_ID,
              branchId: staffResults[0].Branch_ID,
              shiftId: staffResults[0].Shift_ID,
              name: staffResults[0].Name,
              email: staffResults[0].Email,
              type: authResults[0].UserType,
              address: staffResults[0].Address,
              phone: staffResults[0].PhoneNo,
            };
            response.redirect("/" + authResults[0].UserType);
          }
        );
      } else if (authResults[0].UserType == "Manager") {
        connection.query(
          "SELECT * FROM `Staff` WHERE `email` = ?",
          [formData.email],
          function (error, managerResults) {
            if (error) throw error;

            request.session.user = {
              staffId: managerResults[0].Staff_ID,
              branchId: managerResults[0].Branch_ID,
              shift_ID: managerResults[0].Shift_ID,
              name: managerResults[0].Name,
              email: managerResults[0].Email,
              type: authResults[0].UserType,
              address: managerResults[0].Address,
              phone: managerResults[0].PhoneNo,
            };
            response.redirect("/" + authResults[0].UserType);
          }
        );
      }
    }
  );
});

app.post(
  "/customer/details/update",
  isLoggedIn("Customer"),
  (request, response) => {
    const formData = request.body;

    console.log(request.session);

    connection.query(
      "UPDATE `Customer` SET `Name` = ?, `Address` = ?, `PhoneNo` = ? WHERE `CustomerID` = ?",
      [
        formData.name,
        formData.address,
        formData.phone,
        request.session.user.customerId,
      ],
      function (error, results) {
        if (error) throw error;

        request.session.user.name = formData.name;
        request.session.user.address = formData.address;
        request.session.user.phone = formData.phone;

        response.redirect("/customer/details");
      }
    );
  }
);

app.post(
  "/manager/manage-employees/edit/update",
  isLoggedIn("Manager"),
  (request, response) => {
    const formData = request.body;

    const sqlUpdateQuery =
      "UPDATE Staff SET Name = ?, Address = ?, Email = ?, Phone_No = ? WHERE Staff_ID = ?";

    connection.query(
      sqlUpdateQuery,
      [
        formData.name,
        formData.address,
        formData.email,
        formData.phone,
        formData.employee_edit,
      ],
      function (error, results) {
        if (error) throw error;

        response.redirect("/manager/manage-employees");
      }
    );
  }
);

// destroy session on logout
app.get("/logout", (request, response) => {
  request.session.destroy((error) => {
    if (error) {
      console.log(error);
    }
    response.redirect("/login");
  });
});

// redirect index to main login page
app.get("/", (request, response) => {
  response.redirect("/login");
});

// login page
app.get("/login", (request, response) => {
  response.render("login", {
    title: "Login",
  });
});

function isLoggedIn(type) {
  return (request, response, next) => {
    if (request.session.user) {
      if (request.session.user.type == type) {
        return next();
      } else {
        response.redirect("/" + request.session.user.type);
      }
    } else {
      response.redirect("/login");
    }
  };
}

// customer page
app.get("/customer", isLoggedIn("Customer"), (request, response) => {
  const filter = request.query.filter || "price_desc";
  let orderBy;

  switch (filter) {
    case "price_asc":
      orderBy = "CostPrice ASC";
      break;
    case "name_desc":
      orderBy = "Name DESC";
      break;
    case "name_asc":
      orderBy = "Name ASC";
      break;
    default:
      orderBy = "CostPrice DESC";
  }

  const sqlQuery = `SELECT * FROM Stock ORDER BY ${orderBy}`;

  connection.query(sqlQuery, (error, results, fields) => {
    if (error) throw error;

    response.render("customer", {
      title: "Customer View",
      banner_text: "Welcome " + request.session.user.name,
      nav_title: "Browse Products",
      page: request.originalUrl,
      filter: request.query.filter || "price_desc",
      user_session: request.session.user,
      data: results,
    });
  });
});

// customer details page
app.get("/customer/details", isLoggedIn("Customer"), (request, response) => {
	sqlQuery = `SELECT * FROM Customer_Order_View WHERE CustomerID = ${request.session.user.customerId}`
	connection.query(sqlQuery, (error, results, fields) => {
		response.render("customer_details", {
			title: "Your Details",
			banner_text: "Your Details",
			nav_title: "My Account",
			page: request.originalUrl,
			user_session: request.session.user,
			orderHistory: results
		});
	})

});

// staff page
app.get('/staff', isLoggedIn('Staff'), (request, response) => {
    const stockQuery = `SELECT * FROM Stock`;
    const shiftQuery = `
        SELECT Shift.Shift_ID, Shift.Start_Time, Shift.End_Time
        FROM Shift
        INNER JOIN Staff ON Shift.Shift_ID = Staff.Shift_ID
        WHERE Staff.Staff_ID = ?
    `

    connection.query(stockQuery, (stockError, stockResults, stockFields) => {
        if (stockError) throw stockError;

        connection.query(shiftQuery, [request.session.user.staffId], (shiftError, shiftResults, shiftFields) => {
            response.render('staff', {
                title: 'Staff View',
                banner_text: 'Staff View',
                nav_title: 'Inventory Management',
                page: request.originalUrl,
                user_session: request.session.user,
                stockData: stockResults,
                shiftData: shiftResults
            })
        })
    })
})

// manager page
app.get("/manager", isLoggedIn("Manager"), (request, response) => {
    const totalSalesQuery = `
		SELECT SUM(Stock.CostPrice) AS TotalSales
		FROM Stock
		JOIN Item ON Stock.Stock_ID = Item.Stock_ID
	`
	const bestSellingQuery = `
	SELECT
		Stock.Stock_ID,
		Stock.Name AS StockName,
		Stock.CostPrice,
		Stock.Sup_ID AS StockSupplierID,
		COUNT(Item.Stock_ID) AS NumberOfItems
	FROM
		Stock
	LEFT JOIN Item ON Stock.Stock_ID = Item.Stock_ID
	GROUP BY
		Stock.Stock_ID, Stock.Name, Stock.CostPrice, Stock.Sup_ID
	ORDER BY
		NumberOfItems DESC;
	`

	const filter = request.query.filter || "sales_desc";
	let orderBy;
  
	switch (filter) {
	  case "items":
		orderBy = "ItemsSold DESC";
		break;
	  default:
		orderBy = "TotalSales DESC";
	}
	const performanceQuery = `
		SELECT
		Staff.Name AS StaffName,
		TempSales.Staff_ID,
		SUM(TempSales.TotalSales) AS TotalSales,
		SUM(TempSales.TotalItems) AS ItemsSold
	FROM
		(
			SELECT
				Online_Order.Order_ID,
				Online_Order.Staff_ID,
				SUM(Stock.CostPrice) AS TotalSales,
				COUNT(Item.Item_ID) AS TotalItems
			FROM
				Online_Order
			JOIN Item ON Online_Order.Order_ID = Item.Order_ID
			JOIN Stock ON Item.Stock_ID = Stock.Stock_ID
			GROUP BY
				Online_Order.Order_ID, Online_Order.Staff_ID
		) AS TempSales
	JOIN Staff ON TempSales.Staff_ID = Staff.Staff_ID
	GROUP BY
		TempSales.Staff_ID, Staff.Name
	ORDER BY
    	${orderBy};
	`
	const ordersQuery = `SELECT COUNT(Online_Order.Order_ID) AS TotalOrders FROM Online_Order`
	
	connection.query(totalSalesQuery, (error, results, fields) => {
		connection.query(bestSellingQuery, (bestSellingError, bestSellingResults, bestSellingFields) => {
			connection.query(performanceQuery, (performanceError, performanceResults, performanceFields) => {
				connection.query(ordersQuery, (ordersError, ordersResults, ordersFields) => {
					response.render("dashboard", {
						title: "Manager View",
						banner_text: "Welcome, John Doe",
						nav_title: "Dashboard",
						user_session: request.session.user,
						totalSales: results[0].TotalSales,
						bestSelling: bestSellingResults,
						employeePerformance: performanceResults,
						orders: ordersResults[0].TotalOrders,
						filter: filter
					})
				})
			})
		})
	})
});

// manager manage employees page
app.get(
  "/manager/manage-employees",
  isLoggedIn("Manager"),
  (request, response) => {
    const sqlQuery = `SELECT * FROM Staff`;

    connection.query(sqlQuery, (error, results) => {
      if (error) throw error;

      response.render("manage-employees", {
        title: "Manager View",
        banner_text: "Welcome " + request.session.user.name,
        nav_title: "Manage Employees",
        user_session: request.session.user,
        data: results,
      });
    });
  }
);

// manager employee edit page
app.get(
  "/manager/manage-employees/edit",
  isLoggedIn("Manager"),

  (request, response) => {
    const { staffID } = request.query;

    const sqlQuery = `SELECT * FROM Staff WHERE Staff_ID = ${staffID}`;

    connection.query(sqlQuery, (error, results) => {
      if (error) throw error;

      response.render("employees_edit", {
        title: "Edit Employee",
        banner_text: "Welcome " + request.session.user.name,
        nav_title: "Edit Employee",
        user_session: request.session.user,
        data: results,
      });
    });
  }
);

// 404 page
app.use((request, response) => {
  response.status(404);
  response.render("404", {
    title: "404",
  });
});
