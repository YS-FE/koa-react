module.exports =  {
  indexPath: '/', // 渲染的首页路由路径
  
  proxyTables: { // 服务端代理
    '/douban': {
      target: 'http://api.douban.com',
      rewrite: path => path.replace(/^\/douban/, ''),
      changeOrigin: true,
      log: true
    }
  }
}