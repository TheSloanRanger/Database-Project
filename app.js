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
          "SELECT * FROM `Customer` WHERE `email` = ?",
          [formData.email],
          function (error, customerResults) {
            if (error) throw error;

            request.session.user = {
              customerId: customerResults[0].AccountID,
              name: customerResults[0].Name,
              email: customerResults[0].email,
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
              staffId: staffResults[0].Staff_Id,
              branchId: staffResults[0].Branch_ID,
              name: staffResults[0].Name,
              email: staffResults[0].email,
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
              staffId: managerResults[0].Staff_Id,
              branchId: managerResults[0].Branch_ID,
              name: managerResults[0].Name,
              email: managerResults[0].email,
              type: authResults[0].UserType,
              address: managerResults[0].Address,
              phone: managerResults[0].PhoneNo,
              branchId: managerResults[0].BranchID,
              shift,
            };
            response.redirect("/" + authResults[0].UserType);
          }
        );
      }
    }
  );
});

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
  response.render("customer", {
    title: "Customer View",
    banner_text: "Welcome " + request.session.user.name,
    nav_title: "Browse Products",
    page: request.originalUrl,
    filter: request.query.filter || "price_desc",
    user_session: request.session.user,
  });
});

// customer details page
app.get("/customer/details", isLoggedIn("Customer"), (request, response) => {
  response.render("customer_details", {
    title: "Your Details",
    banner_text: "Your Details",
    nav_title: "My Account",
    page: request.originalUrl,
    user_session: request.session.user,
  });
});

// staff page
app.get("/staff", isLoggedIn("Staff"), (request, response) => {
  response.render("staff", {
    title: "Staff View",
    banner_text: "Staff View",
    nav_title: "Inventory Management",
    page: request.originalUrl,
    user_session: request.session.user,
  });
});

// manager/performance page
app.get("/manager/performance", isLoggedIn("Manager"), (request, response) => {
  response.render("performance", {
    title: "Manager View",
    banner_text: "Welcome, John Doe",
  });
});

// manager page
app.get("/customer", isLoggedIn("customer"), (request, response) => {
  response.render("customer", {
    title: "Customer View",
    banner_text: "Welcome " + request.session.user.name,
    nav_title: "Browse Products",
    page: request.originalUrl,
    filter: request.query.filter || "price_desc",
    user_session: request.session.user,
    connection: connection,
  });
});

// customer details page
app.get("/customer/details", isLoggedIn("customer"), (request, response) => {
  response.render("customer_details", {
    title: "Your Details",
    banner_text: "Your Details",
    nav_title: "My Account",
    page: request.originalUrl,
    user_session: request.session.user,
  });
});

// staff page
app.get("/staff", isLoggedIn("staff"), (request, response) => {
  response.render("staff", {
    title: "Staff View",
    banner_text: "Staff View",
    nav_title: "Inventory Management",
    page: request.originalUrl,
    user_session: request.session.user,
  });
});

// manager dashboard page
app.get("/manager", isLoggedIn("Manager"), (request, response) => {
    response.render("dashboard", {
        title: "Manager View",
        banner_text: 'Welcome ' + request.session.user.name,
        nav_title: "Dashboard",
        user_session: request.session.user
    });
});

  // manager manage employees page
app.get("/manager/manage-employees", isLoggedIn("Manager"), (request, response) => {
    response.render("manage-employees", {
        title: "Manager View",
        banner_text: 'Welcome ' + request.session.user.name,
        nav_title: "Manage Employees",
        user_session: request.session.user
    });
});

// manager employee edit page
app.get("/manager/manage-employees/edit", isLoggedIn("Manager"), (request, response) => {
    response.render("employees_edit", {
        title: "Edit Employee",
        banner_text: 'Welcome ' + request.session.user.name,
        nav_title: "Edit Employee",
        user_session: request.session.user
    });
});

// 404 page
app.use((request, response) => {
  response.status(404);
  response.render("404", {
    title: "404",
  });
});
