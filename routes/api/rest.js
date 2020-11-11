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
  console.log(ip);
  try {
    if (ip === "" || ip === undefined) {
      return res.json({ message: "invalid IP format" });
    }
    var found_user = await user
      .find({ ipAddress: ip })
      .exec()
      .catch((err) => console.error(err));
    if (!(found_user[0] === undefined)) {
      return res.json(found_user[0]);
    } else {
      var found_user = await user.create({ ipAddress: ip });
      return res.json(found_user);
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
  id = req.body["id"];
  savings_ = req.body["savings"];
  income_ = req.body["income"];
  expenses_ = req.body["expenses"];

  var found_user = await user.findById(
    id.exec().catch((err) => {
      return res.json({ message: "user not found" });
    })
  );

  const newBudget = await budget.create({
    savings: savings_,
    income: income_,
    expenses: expenses_,
    user: found_user,
  });
  found_user = await user.findByIdAndUpdate(id, {
    $push: { budgets: newBudget },
  });
  return res.json(found_user);
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
      return res.json({ message: "user not found" });
    });

  return res.json(found_user.budgets);
});

module.exports = router;
