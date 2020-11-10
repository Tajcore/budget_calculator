// Server 
const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

// Models
const budget = require("../../models/budget_schema");
const user = require("../../models/user_schema");

mongoose
  .connect("mongodb://localhost:27017/budgetcalc", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((err => console.error(err)));


const db = mongoose.connection

db.on('error', console.error.bind(console,'Connection error:'));



/**
 * @method POST
 * @access public
 * @endpoint /api/budget
 **/


router.post('/budget', (req, res) => {
    res.json({
        message: 'POST API for creating budget',
    });
});


/**
 * @method GET
 * @access public
 * @endpoint /api/budgets/:ip
 **/


router.get('/budgets', (req, res) => {
    res.json({
        message: 'GET API for getting budget',
    });
});

module.exports = router;