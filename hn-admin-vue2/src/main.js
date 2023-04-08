import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import myDirective from './util/myDirective.js'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/iconfont/iconfont.css'
// 引入需要全局注册的组件
import pagination from './components/pagintion.vue'

Vue.config.productionTip = false
// 在vue实例上定义自定义指令
Object.keys(myDirective).forEach((item,index) => {
  Vue.directive(item,Object.values(myDirective)[index])
})
// 注册全局组件
Vue.component('pagination',pagination)

Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
