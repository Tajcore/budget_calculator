const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

const connect = function () {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage().then(() => {
        mongoose
          .createConnection(DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
          })
          .then(() => {
            console.log("Test Server Started");
            resolve();
          })
          .catch((err) => console.error(err));
      });
    } else {
      mongoose
        .connect(DB_URI, { useNewUrlParser: true, useCreateIndex: true })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        });
    }
  });
};

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
