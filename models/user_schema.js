const mongoose = require("mongoose");

const User = mongoose.Schema;

const userModel = new User({
  ipAddress: {
    type: String,
    unique: true,
    required: true,
  },
  lastAccess: {
    type: Date,
    default: Date.now,
  },

  budgets: [{
      type: User.Types.ObjectId,
      ref: "budgetModel"
  }]
});


module.exports = mongoose.model('userModel', userModel);