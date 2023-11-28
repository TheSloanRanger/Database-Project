const express = require('express');
const morgan = require('morgan');
const { exec } = require('child_process')

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(morgan('dev'));

app.listen(3000) // localhost:3000

// redirect index to customer pages
app.get('/', (request, response) => {
    response.redirect('/customer');
})

// customer page
app.get('/customer', (request, response) => {
    response.render('customer', {
        title: 'Customer View',
        banner_text: 'Welcome, John Doe'
    })
})

// 404 page
app.use((request, response) => {
    response.status(404);
    response.render('404', {
        title: '404'
    });
})