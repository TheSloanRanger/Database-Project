const express = require("express");
const morgan = require("morgan");
const { exec } = require("child_process");

// sql
const mysql = require("mysql");

// express app
const app = express();
const connection = mysql.createConnection({
  host: "dbms.cctayzmswrni.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  port: "3306",
  timeout: 60000,
  acquireTimeout: 60000,
});

connection.end();

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
app.post("/login-form", (request, response) => {
  const formData = request.body; // email/password from login form

  request.session.user = {
    type: "customer",
    name: "Steve Smith",
    email: "test@email.com",
    phone: "0123456789",
    address: "123 Main Street, Dundee, ABC123",
  }; // test user to test sessions
  response.redirect("/customer"); // redirect to page based on user type
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
    /*if (request.session.user){
            if (request.session.user.type == type){
                return next();
            } else {
                response.redirect('/'+request.session.user.type);
            }
        } else {
            response.redirect('/login');
        }*/
    return next(); // remove when login implemented
  };
}

// customer page
app.get("/customer", isLoggedIn("customer"), (request, response) => {
  response.render("customer", {
    title: "Customer View",
    banner_text: "Welcome " + request.session.user.name,
    nav_title: "Browse Products",
    page: request.originalUrl,
    filter: request.query.filter || "price_desc",
    customer_session: request.session.user,
  });
});

// customer details page
app.get("/customer/details", isLoggedIn("customer"), (request, response) => {
  response.render("customer_details", {
    title: "Your Details",
    banner_text: "Your Details",
    nav_title: "My Account",
    page: request.originalUrl,
    customer_session: request.session.user,
  });
});

// staff page
app.get("/staff", isLoggedIn("staff"), (request, response) => {
  response.render("staff", {
    title: "Staff View",
    banner_text: "Staff View",
    nav_title: "Inventory Management",
    page: request.originalUrl,
    customer_session: request.session.user,
  });
});

// manager/performance page
app.get("/manager/performance", (request, response) => {
  response.render("performance", {
    title: "Manager View",
    banner_text: "Welcome, John Doe",
  });
});

// manager page
app.get("/manager/manage-employees", (request, response) => {
  response.render("manage-employees", {
    title: "Manager View",
    banner_text: "Welcome, John Doe",
  });
});

// 404 page
app.use((request, response) => {
  response.status(404);
  response.render("404", {
    title: "404",
  });
});
