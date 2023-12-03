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

app.post(
  "/manager/manage-employees/delete",
  isLoggedIn("Manager"),
  (request, response) => {
    const formData = request.body;

    const sqlDeleteQuery = "DELETE FROM Staff WHERE Staff_ID = ?";
    connection.query(
      sqlDeleteQuery,
      [formData.employee_delete],
      function (error, results) {
        if (error) throw error;

        response.redirect("/manager/manage-employees");
      }
    );
  }
);
app.post("/restock-item", isLoggedIn("Staff"), (request, response) => {
	const formData = request.body;

	console.log(formData);

	const sqlUpdateQuery = `UPDATE Stock SET Count = ? WHERE Stock_ID = ?`

	connection.query(sqlUpdateQuery, [parseInt(formData.newQty) + parseInt(formData.currentQty), formData.stockID], function (error, results){
		if (error) throw error;

		response.redirect("/staff");
	})
})


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
  const search = request.query.search || "";
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

  const sqlProcedure = 'CALL GetStockView(?, ?)';

  connection.query(sqlProcedure, [search, orderBy], (error, results) => {
		if (error) throw error;

		response.render("customer", {
			title: "Customer View",
			banner_text: "Welcome, " + request.session.user.name,
			nav_title: "Browse Products",
			page: request.originalUrl,
			filter: request.query.filter || "price_desc",
			search: search,
			user_session: request.session.user,
			data: results[0],
		});
	});
});

// customer details page
app.get("/customer/details", isLoggedIn("Customer"), (request, response) => {
    sqlQuery = `SELECT * FROM Customer_Order_View WHERE CustomerID = ?`;
    connection.query(sqlQuery, [request.session.user.customerId], (error, results, fields) => {
		if (error) return error;

		response.render("customer_details", {
			title: "Your Details",
			banner_text: "Your Details",
			nav_title: "My Account",
			page: request.originalUrl,
			user_session: request.session.user,
			orderHistory: results,
		});
    });
});

// staff page
app.get("/staff", isLoggedIn("Staff"), (request, response) => {
	const filter = request.query.filter || "stock_desc";
	const search = request.query.search || "";
	let orderBy;

	switch (filter) {
		case "stock_asc":
		orderBy = "Count ASC";
		break;
		case "name_desc":
		orderBy = "Name DESC";
		break;
		case "name_asc":
		orderBy = "Name ASC";
		break;
		default:
		orderBy = "Count DESC";
	}

	let stockQuery = `SELECT * FROM Stock WHERE Name LIKE ? ORDER BY ${orderBy}`;

	const shiftQuery = `
		SELECT Shift.Shift_ID, Shift.Start_Time, Shift.End_Time
		FROM Shift
		INNER JOIN Staff ON Shift.Shift_ID = Staff.Shift_ID
		WHERE Staff.Staff_ID = ?
	`;

	orderQuery = `SELECT * FROM CFV WHERE Staff_ID = ?`;

	connection.query(stockQuery, ['%'+search+'%'], (stockError, stockResults) => {
		if (stockError) throw stockError;

		connection.query(shiftQuery, [request.session.user.staffId], (shiftError, shiftResults) => {
			if (shiftError) throw shiftError;

			connection.query(orderQuery, [request.session.user.staffId], (orderError, orderResults) => {
				if (orderError) throw orderError;
				
				response.render("staff", {
					title: "Staff View",
					banner_text: "Staff View",
					nav_title: "Inventory Management",
					page: request.originalUrl,
					user_session: request.session.user,
					stockData: stockResults,
					shiftData: shiftResults,
					filter: filter,
					search: search,
					orderHistory: orderResults,
				})
			})
		})
	})
})

// Manager dashboard page
app.get("/manager", isLoggedIn("Manager"), (request, response) => {
  const bestSellingQuery = `
    SELECT s.Name, COUNT(*) AS TotalSales
    FROM Item i
    JOIN Stock s ON i.Stock_ID = s.Stock_ID
    JOIN Online_Order o ON i.Order_ID = o.Order_ID
    GROUP BY s.Name
    ORDER BY TotalSales DESC
    LIMIT 3;
  `;

  const newCustomersQuery = `
    SELECT COUNT(DISTINCT Cust_ID) AS NewCustomers
    FROM Online_Order;
  `;

  const totalRevenueQuery = `
    SELECT ROUND(SUM(s.CostPrice), 2) AS Revenue
    FROM Item i
    JOIN Stock s ON i.Stock_ID = s.Stock_ID;
  `;

  const totalOrdersQuery = `
    SELECT COUNT(DISTINCT Order_ID) AS TotalOrders
    FROM Online_Order;
  `;

  const employeePerformanceQuery = `
    SELECT st.Name, COUNT(DISTINCT oo.Order_ID) AS NumberOfOrders, ROUND(SUM(s.CostPrice), 2) AS Revenue
    FROM Staff st
    LEFT JOIN Online_Order oo ON st.Staff_ID = oo.Staff_ID
    LEFT JOIN Item i ON oo.Order_ID = i.Order_ID
    LEFT JOIN Stock s ON i.Stock_ID = s.Stock_ID
    GROUP BY st.Name;
  `;

  // Query for best selling products
  connection.query(bestSellingQuery, (bestSellingError, bestSellingResults) => {
    if (bestSellingError) {
      console.error('Error fetching best-selling products:', bestSellingError);
      response.status(500).send("Error fetching best-selling products");
      return;
    }

    // Query for new customers
    connection.query(newCustomersQuery, (newCustomersError, newCustomersResults) => {
      if (newCustomersError) {
        console.error('Error fetching new customers:', newCustomersError);
        response.status(500).send("Error fetching new customers");
        return;
      }

      // Query for total revenue
      connection.query(totalRevenueQuery, (totalRevenueError, totalRevenueResults) => {
        if (totalRevenueError) {
          console.error('Error fetching revenue:', totalRevenueError);
          response.status(500).send("Error fetching revenue");
          return;
        }

        // Query for total orders
        connection.query(totalOrdersQuery, (totalOrdersError, totalOrdersResults) => {
          if (totalOrdersError) {
            console.error('Error fetching total orders:', totalOrdersError);
            response.status(500).send("Error fetching total orders");
            return;
          }

          // Query for employee performance
          connection.query(employeePerformanceQuery, (employeePerformanceError, employeePerformanceResults) => {
            if (employeePerformanceError) {
              console.error('Error fetching employee performance:', employeePerformanceError);
              response.status(500).send("Error fetching employee performance");
              return;
            }

            // Sort employee performance data by number of orders by default
            employeePerformanceResults.sort((a, b) => b.NumberOfOrders - a.NumberOfOrders);

            // Render the dashboard view with all results
            response.render("dashboard", {
              title: "Manager View",
              banner_text: "Welcome, John Doe",
              nav_title: "Dashboard",
              user_session: request.session.user,
              bestSellingProducts: bestSellingResults,
              newCustomers: newCustomersResults[0].NewCustomers,
              revenue: totalRevenueResults[0].Revenue,
              totalOrders: totalOrdersResults[0].TotalOrders,
              employeePerformance: employeePerformanceResults
            });
          });
        });
      });
    });
  });
});

// manager manage employees page
app.get(
  "/manager/manage-employees",
  isLoggedIn("Manager"),
  (request, response) => {
    const sqlQuery = `SELECT * FROM Staff WHERE Delete_Flag = 0`;

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

app.get(
  "/manager/manage-employees/delete",
  isLoggedIn("Manager"),

  (request, response) => {
    const { staffID } = request.query;

    const sqlQuery = `UPDATE Staff SET Delete_Flag = ? WHERE Staff_ID = ?`;

    connection.query(sqlQuery, [1, staffID], (error, results) => {
      if (error) throw error;

      response.redirect("/manager/manage-employees");
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
