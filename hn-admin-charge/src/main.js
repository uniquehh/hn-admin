import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import ElSelectTree from 'el-select-tree'
import './assets/styles/element-variables.scss'
import './assets/icons/iconfont/iconfont.css'

// 适配
import 'lib-flexible/flexible.js'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download ,HttpGetDown} from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { formatSeconds, parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree,statusConfig,statusColor } from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
import VueAMap from 'vue-amap'

import echarts from "echarts";
Vue.prototype.$echarts = echarts;


// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.formatSeconds = formatSeconds
Vue.prototype.parseTime = parseTime
Vue.prototype.statusConfig = statusConfig
Vue.prototype.statusColor = statusColor
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.HttpGetDown = HttpGetDown
Vue.prototype.handleTree = handleTree

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(ElSelectTree)
Vue.use(VueAMap);
DictData.install()

/*
  Echartmap需要
*/
import global from './utils/global' // 全局方法 
Vue.use(global)

// -----------------


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

VueAMap.initAMapApiLoader({
  key: '398a72c3e3f9b5c8898852eae04de90b',// 高德的key  
  // 插件集合
  plugin: [
    'AMap.CircleEditor',// 圆形编辑器插件
    "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder", // 地理编码与逆地理编码服务，用于地址描述与坐标间的相互转换
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.CitySearch",
  ],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
});
//高德的安全密钥 
window._AMapSecurityConfig = {
  securityJsCode: 'a14dcaa5478a5f9ce2333c19abdbfe27',
}
