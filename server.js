require('dotenv').config();

const app = require('./app');
const db = require('./db');
// use port from environment variables for production
const PORT = process.env.PORT || 5000;

db.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log('Listening on port: ' + PORT);
    });
  });