const { MongoClient } = require('mongodb');

const connections = new WeakMap();

const DEFAULT_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: process.env.MONGODB_POOLSIZE || 1
}

class MongoDBProvider {
  static createOptions(options) {
    return Object.assign({}, DEFAULT_OPTIONS, options);
  }

  static connect(url, options) {
    return new MongoDBProvider(url, options);
  }

  // Pass MongoClient as dependency
  constructor(url, options) {
    const connection = MongoClient.connect(url, MongoDBProvider.createOptions(options));
    connections.set(this, connection);
  }

  getConnection() {
    return connections.get(this)
      .then(connection => connection);
  }

  getDb(dbName, options) {
    return this.getConnection()
      .then(connection => connection.db(dbName, options))
  }

  close(force) {
    return this.getConnection()
      .then(connection => connection.close(force))
      .then(() => {
        connections.delete(this);
      })
  }
}

export default MongoDBProvider;