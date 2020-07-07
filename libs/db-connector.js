const { MongoClient } = require('mongodb');
const config = require('../config/config');

const DB_URL = Symbol('DB_URL');
const DB_REF = Symbol('DB_REF');

class DBConnector {
  constructor(url) {
    this[DB_URL] = url;
    this.connect();
  }

  connect() {
    return MongoClient
      .connect(this[DB_URL], {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(client => {
        this[DB_REF] = client.db();
        return this[DB_REF];
      })
      .catch(err => {
        console.error(err);
      });
  }

  getDB() {
    return !!this[DB_REF]
      ? Promise.resolve(this[DB_REF])
      : this.connect();
  }
}

const dbConnector = new DBConnector(config.DB_URL);

module.exports = dbConnector;
