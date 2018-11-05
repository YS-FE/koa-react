const Router = require('koa-router');
const apiRouter =  new Router({prefix: '/api'});

apiRouter.get('/user', async (ctx ,next) => {
  ctx.status = 200;
  ctx.body = {
    name: 'lisi',
    age: 20
  }
});

module.exports = apiRouter;

