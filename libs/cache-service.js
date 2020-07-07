const dbConnector = require('./db-connector');

const cacheCollectionName = 'render_cache';
const cacheParamName = 'view';

(async function createCache() {
  const db = await dbConnector.getDB();

  const expireIndex = db.collection(cacheCollectionName)
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: 10 });

  const paramIndex = db.collection(cacheCollectionName)
    .createIndex({ [cacheParamName]: 'text' });

  await Promise.all([expireIndex, paramIndex]);
})();

function cacheMiddleware(viewName) {
  return (ctx, next) => {
    return dbConnector.getDB()
      .then(db => {
        return db.collection(cacheCollectionName).findOne({
          [cacheParamName]: viewName
        }).then(result => {
          if (result && result.body) {
            return result.body;
          } else {
             return next()
              .then(renderedContent => {
                // no wait
                db.collection(cacheCollectionName).insertOne({
                  createdAt: new Date(),
                  [cacheParamName]: viewName,
                  body: renderedContent
                });

                return renderedContent;
              }
            )
          }
        })
      })
  }
}

exports.cacheMiddleware = cacheMiddleware;