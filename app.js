const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// excluding dotenv config from production
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// CORS Middleware
app.use(cors());

// express middleware handling the body parsing 
app.use(express.json());

// express middleware handling the form parsing
app.use(express.urlencoded({extended: false}));

// middleware for handling sample api routes
app.use('/api', require('./routes/api/rest'));

// create static assets from react code for production only
if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'client2/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client2', 'build', 'index.html'));
    });
}

if (process.env.NODE_ENV === 'testing') {
    app.use(express.static( 'client2/build' ));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client2', 'build', 'index.html'));
    });
}

module.exports = app;
