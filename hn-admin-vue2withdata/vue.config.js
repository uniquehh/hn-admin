const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: "all",
    host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    proxy: {
      '/api': {
        target: 'http://3tjpx7.natappfree.cc', //代理的服务器-即请求访问的服务器地址
        changeOrigin: true,
        ws: true, //如果要代理支持 websockets，配置这个参数
        secure: false, //如果是https接口，需要配置这个参数
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
})
