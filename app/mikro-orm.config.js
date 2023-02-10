const allEntities = require('./entities');

require('dotenv').config()

module.exports = {
  entities: allEntities,
  type: "mysql",
  clientUrl: process.env.DATABASE_URL,
  driverOptions: {
    connection: {
        ssl: {
          require: true,
          rejectUnauthorized: true,
        }
      }
  },
};