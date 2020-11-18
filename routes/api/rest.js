// Server
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// Models
const budget = require("../../models/budget_schema");
const user = require("../../models/user_schema");

/**
 * @method POST
 * @access public
 * @endpoint /api/user
 **/

router.post("/user", async (req, res) => {
  ip = req.body.ip;
  try {
    if (ip === "" || ip === undefined) {
      return res.status(500).send({ message: "invalid IP format" });
    }
    var found_user = await user
      .find({ ip_address: ip })
      .exec()
      .catch((err) => console.error(err));
    if (!(found_user[0] === undefined)) {
      return res.status(200).send(found_user[0]);
    } else {
      var found_user = await user.create({ ip_address: ip });
      return res.status(200).send(found_user);
    }
  } catch (err) {
    console.error(err);
  }
});

/**
 * @method POST
 * @access public
 * @endpoint /api/budget
 **/

router.post("/budget", async (req, res) => {
  date_submitted_ = Date.now();
  id = req.body["id"];
  totalProfit_ = req.body["total_profit"];
  incomes_ = req.body["incomes"];
  expenses_ = req.body["expenses"];

  var found_user = await user
    .findById(id)
    .exec()
    .catch((err) => {
      return res.status(404).send({ message: "user not found" });
    });

  const date_diff = Math.abs(found_user.last_access - Date.now());
  if (date_diff < 2592000000) {
    return res
      .status(500)
      .send({ error: "please wait a month to submit another budget" });
  }
  const newBudget = await budget.create({
    total_profit: totalProfit_,
    incomes: incomes_,
    expenses: expenses_,
    date_submitted: date_submitted_,
  });
  found_user = await user.findByIdAndUpdate(id, {
    $push: { budgets: newBudget },
    last_access: date_submitted_,
  });
  return res.status(200).send(newBudget);
});

/**
 * @method GET
 * @access public
 * @endpoint /api/budgets?id=USERID
 **/

router.get("/budgets", async (req, res) => {
  id = mongoose.Types.ObjectId(req.query.id);

  var found_user = await user
    .findOne(id)
    .populate("budgets")
    .exec()
    .catch(() => {
      return res.status(404).send({ message: "user not found" });
    });

  return res.status(200).send(found_user.budgets);
});

/**
 * @method GET
 * @access public
 * @endpoint /api/budget?id=BUDGETID
 */

router.get("/budget", async (req, res) => {
  id = mongoose.Types.ObjectId(req.query.id);

  var found_budget = await budget
    .findOne(id)
    .exec()
    .catch(() => {
      return res.status(404).send({ message: "Budget not found" });
    });

  return res.status(200).send(found_budget);
});
module.exports = router;
