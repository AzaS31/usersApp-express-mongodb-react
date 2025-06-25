require('dotenv').config();
const app = require('./app');
const { connectDb } = require('./database/db');
const logger = require('./logs/logger');

const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

connectDb(uri)
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    logger.error('Could not connect to DB: ' + err.message);
    process.exit(1);
  });
