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

app.listen(3000)

app.get('/', (request, response) => {
    response.render('index', {
        title: 'Home'
    })
})

app.get('/customer', (request, response) => {
    response.render('customer', {
        title: 'Customer View',
        banner_text: 'Welcome, John Doe'
    })
})

// 404 page
app.use((request, response) => {
    response.render('404', {
        title: '404'
    });
})