const fs = require("fs");
const path = require("path");
const ReactDOMServer = require("react-dom/server");

const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const bodyParser =  require('koa-bodyparser');
const logger =  require('koa-logger');
const favicon = require('koa-favicon');
const session  = require('koa-session');
const compression = require('koa-compress');
const convert = require('koa-convert');
const proxy = require('koa-proxies');
const static = require('koa-static');
const views = require('koa-views');
const chalk = require('chalk');
const Loadable = require('react-loadable');
const { getBundles } = require('react-loadable/webpack');


const app = new Koa()

const config = require('./config');
const {apiRouter} = require('./router');


// 配置代理
Object.keys(config.proxyTables).forEach(key => {
  app.use(proxy(key, config.proxyTables[key]));
});


const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 8883;

const serve = (root, cache) => static(root, {
  index: 'useless',
  maxage: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});



app.use(logger());
app.use(convert(session(app)))
app.use(compression({ threshold: 0}));
app.use(bodyParser());
app.use(json());
app.use(favicon(path.resolve(__dirname, '/public/favicon.ico')));


app.use(serve('./dist', true));
app.use(serve('./public', true));

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());


let serverEntry;
let template;
let readyPromise;

if (isProd) {
  loadableJson = require('./dist/react-loadable.json');
  serverEntry = require("./dist/entry-server");
  app.use(views(path.resolve(__dirname, './dist'), {map: {html: 'ejs'}}));
  
} else {
  app.use(views(path.resolve(__dirname, './temp'), {map: {html: 'ejs'}}));
  readyPromise = require("./build/setup-dev-server")(app, (entry, htmlTemplate) => {
    serverEntry = entry;
    template = htmlTemplate;
    fs.writeFileSync(path.join(__dirname, '/temp/index.html'),template, 'utf8');
  });
}


const render =  async (ctx, next) => {
    ctx.set("Content-Type", "text/html");

    let scripts = '';
    let context = {
      currURL: ctx.url,
      modules: []
    };

    let  entry = await serverEntry(context);
    let  html =  await ReactDOMServer.renderToString(entry);

    if (isProd) {
      let bundles = getBundles(loadableJson, context.modules);
      scripts = bundles.map(bundle => {
        return `<script src="/dist/${bundle.file}"></script>`
      }).join('\n');
    }

    if (context.url) {
      ctx.redirect(context.url);
    } else {
      await ctx.render('index', {
        root: html,
        state: context.state,
        scripts: scripts
      });
    }
}


const router = new Router();
router.get('*', isProd ? render : async (ctx, next) => {
  await readyPromise.then(() =>  render(ctx))
});
app.use(router.routes()).use(router.allowedMethods())



if (isProd) {
  Loadable.preloadAll().then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`\n ✈️ ✈️ server listening on ${port}, open http://localhost:${port} in your browser`));
    });
  })
} else {
  app.listen(port, () => {
    console.log(chalk.green(`\n ✈️ ✈️ server listening on ${port}, open http://localhost:${port} in your browser`));
  });
}
