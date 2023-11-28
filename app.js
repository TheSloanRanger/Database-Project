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