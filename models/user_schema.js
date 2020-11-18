const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  ip_address: { type: String, required: true },
  budgets: [{ type: Schema.Types.ObjectId, ref: "Budget" }],
  last_access: { type: Date },
});

module.exports = mongoose.model("User", User);
