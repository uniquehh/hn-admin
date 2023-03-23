import { createApp,getCurrentInstance } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import myDirective from './util/myDirective.js'
import baseURL from "./util/config.js"
import myAxios from './util/myAxios'

const newApp = createApp(App)

// 请求的基本接口前缀
newApp.baseURL = baseURL.APIURL
console.log(newApp)
newApp.use(store)
newApp.use(router)
// 在vue实例上定义自定义指令
console.log(Object.keys(myDirective),Object.values(myDirective),8888)
Object.keys(myDirective).forEach((item,index) => {
  newApp.directive(item,Object.values(myDirective)[index])
})

// 全局变量
newApp.config.globalProperties.$axios = myAxios

newApp.mount('#app')
