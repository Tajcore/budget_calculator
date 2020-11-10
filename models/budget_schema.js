const mongoose = require("mongoose");

const Budget = mongoose.Schema;

const budgetModel = new Budget({
  savings: {
    type: Number,
    require: true,
  },
  income: {
    type: Number,
    require: true,
  },
  expenses: {
    type: Number,
    require: true,
  },
  user: {
      type: Budget.Types.ObjectId,
      ref: "userModel"
  }
});

module.exports = mongoose.model("budgetModel", budgetModel);
