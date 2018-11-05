const path = require("path");
const webpack = require("webpack");
const MFS = require('memory-fs');
const clientConfig = require("./webpack.config.client");
const serverConfig = require("./webpack.config.server");
const convert = require('koa-convert');

module.exports = function setupDevServer(app, callback) {
  let serverEntry;
  let template;
  let resolve;

  const readyPromise = new Promise(r => { resolve = r });
  
  const update = () => {
    if (serverEntry && template) {
      callback(serverEntry, template);
      resolve();
    }
  }

  const readFile = (fs, fileName) => {
    return fs.readFileSync(path.join(clientConfig.output.path, fileName), "utf-8");
  }

 
  clientConfig.entry.app = ["webpack-hot-middleware/client", clientConfig.entry.app];
  clientConfig.output.filename = "static/js/[name].[hash].js";
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());


  const clientCompiler = webpack(clientConfig);

  const devMiddleware = require("koa-webpack-dev-middleware")(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  });

  app.use(convert(devMiddleware));

  /* eslint-disable no-console */
  clientCompiler.plugin("done", stats => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }
    template = readFile(devMiddleware.fileSystem, "index.html");
    devMiddleware.fileSystem.unlinkSync(path.join(clientConfig.output.path, "index.html"));
    update();
  });


  // 热更新中间件
  app.use(convert(require("koa-webpack-hot-middleware")(clientCompiler)));

  const serverCompiler = webpack(serverConfig);
  
  //内存文件系统
  const mfs = new MFS();
  serverCompiler.outputFileSystem = mfs;
  serverCompiler.watch({}, (err, stats) => {
    const info = stats.toJson();
    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    if (stats.hasErrors()) {
      console.error(info.errors);
      return;
    }

    // 读取打包后的内容并编译模块
    const bundle = readFile(mfs, "entry-server.js");
    const m = new module.constructor();
    m._compile(bundle, "entry-server.js");
    serverEntry = m.exports;
    update();
  });

  return readyPromise;
}
