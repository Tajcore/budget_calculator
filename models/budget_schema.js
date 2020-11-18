const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Budget = new Schema({
  total_profit: { type: Number, required: true },
  expenses: [
    {
      description: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
  incomes: [
    {
      description: { type: String, required: true },
      value: { type: Number, required: true },
    },
  ],
  date_submitted: { type: Date, required: true },
});

module.exports = mongoose.model("Budget", Budget);
