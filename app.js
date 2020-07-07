const path = require('path');

require('dotenv').config();
const Koa = require('koa');
const views = require('koa-views');
const Router = require('koa-router');

const config = require('./config/config');
const { cacheMiddleware } = require('./libs/cache-service');

const app = new Koa();
const router = new Router();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

app.use(views(path.join(__dirname, 'views'), {
  autoRender: false,
  extension: 'pug',
  map: {
    html: 'nunjucks',
    hbs: 'handlebars'
  },
  options: {
    basedir: path.join(__dirname, 'views')
  }
}));

router.get(
  '/',
  async (ctx, next) => {
    const renderedContent = await next();
    ctx.body = renderedContent;
  },
  cacheMiddleware('index'),
  async (ctx, next) => {
    await delay(2000);
    return ctx.render('index');
  }
);

router.get(
  '/about',
  async (ctx, next) => {
    const renderedContent = await next();
    ctx.body = renderedContent;
  },
  cacheMiddleware('about'),
  async (ctx, next) => {
    await delay(2000);
    return ctx.render('about');
  }
);

app.use(router.routes());

if (!module.parent) {
  app.listen(config.PORT, () => {
    console.log(`App is running on http://localhost:${config.PORT}`)
  })
}

module.exports = app;