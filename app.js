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

connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
  if (err) throw err;

  console.log("The solution is: ", rows[0].solution);
});

connection.end();

// register view engine
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(express.json());

app.listen(3000); // localhost:3000


// handle login form submissions **validate logins against db here**
app.post('/customer', (request, response) => {
    const formData = request.body;
    //response.send(formData);
    response.redirect('/customer');
})
app.post('/staff', (request, response) => {
    const formData = request.body;
    //response.send(formData);
    response.redirect('/staff');
})
app.post('/manager', (request, response) => {
    const formData = request.body;
    //response.send(formData);
    response.redirect('/manager');
})


// redirect index to customer pages
app.get("/", (request, response) => {
  response.redirect("/login");
});

// login pages
app.get('/login', (request, response) => { // login options
    response.render('login', {
        title: 'Login Options'
    })
})
app.get('/login/customer', (request, response) => { // customer login
    response.render('login_customer', {
        title: 'Customer Login'
    })
})
app.get('/login/staff', (request, response) => { // staff login
    response.render('login_staff', {
        title: 'Staff Login'
    })
})
app.get('/login/manager', (request, response) => { // manager login
    response.render('login_manager', {
        title: 'Manager Login'
    })
})

// customer page
app.get('/customer', (request, response) => {
    response.render('customer', {
        title: 'Customer View',
        banner_text: 'Welcome, John Doe',
        nav_title: 'Browse Products',
        page: request.originalUrl
    })
})

// customer details page
app.get('/customer/details', (request, response) => {
    response.render('customer_details', {
        title: 'Your Details',
        banner_text: 'Your Details',
        nav_title: 'My Account',
        page: request.originalUrl
    })
})

// staff page
app.get('/staff', (request, response) => {
    response.render('staff', {
        title: 'Staff View',
        banner_text: 'Staff View',
        nav_title: 'Inventory Management',
        page: request.originalUrl
    })
})

// 404 page
app.use((request, response) => {
  response.status(404);
  response.render("404", {
    title: "404",
  });
});
