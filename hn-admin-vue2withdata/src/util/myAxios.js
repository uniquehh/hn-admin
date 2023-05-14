import axios from 'axios'
const urlConfig = require('./config')
import methods from './methods' 
import domMessage from './onceMsg'

// new 对象实例
const messageOnce = new domMessage()


const axiosInstance = axios.create({
  baseURL: urlConfig.preApi, // urlConfig.preApi 接口前缀--代理后会重写去除
  timeout: 6000,
  headers: {'Content-Type': 'application/json;charset=utf-8'}
})

// 请求拦截器 此处的config设置会覆盖 axiosInstance.defaults 设置
axiosInstance.interceptors.request.use((config) => {
  // console.log(config)
  // 接口地址--此处若设置了url，则network的header信息的url就会显示apiUrl即去除了前缀的完整请求接口
  // 若没有设置不对url做处理，则network -> header 中显示的是本地主机地址 在加上请求的接口传入的后缀
  // 即设置了url 显示为 urlConfig.apiUrl + config.url 即 http://ugxzrf.natappfree.cc/auth/login 去除了/api前缀
  // 不设置显示为 http://localhost:8080/api/auth/login 不会去除/api的前缀
  if(!config.url.includes("http")){
    config.url = urlConfig.apiUrl + config.url
  }

  // 每个请求都携带token
  // console.log(config)
  if (localStorage.getItem('userInfo')) {
    config.headers['token'] = JSON.parse(localStorage.getItem('userInfo')).token
  }

  // if (config.method == 'put') {
  //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset:utf-8'
  // }
  return config;
}, (error) => {
  return Promise.reject(error,'请求拦截器走了错误入口');
})
  
// 响应拦截器
axiosInstance.interceptors.response.use((res) => {
  // console.log(res, 'axios')
  if (res.status == 200) { //res第一层是 axios 返回的
    if (res.data.code == -1) {
      messageOnce.warning({
        message: res.data.data.errMsg,
        type: 'warning',
        duration:3000,
      })
      // methods.hnMsg(res.data.data.errMsg,'error')
      if(res.data.data.errCode==20001){
        setTimeout(() => {
          methods.loginOut(false)
        }, 2000);
      }
    }
    
    return res.data //res.data是  axios 请求目标接口返回的数据
  } else {
    methods.hnMsg('接口请求失败',res)
  }
}, (error) => {
  messageOnce.warning({
    message: '服务器异常,请求失败',
    type: 'error'
  })
  // methods.hnMsg('服务器异常,请求失败','error')
  return Promise.reject(error);
})


export default function requset(url, data = {}, method = 'get',ct='json') {
  method = method.toLowerCase();//统一将方法转换为小写字母
  // 删除空参数
  // if(typeof data == 'object')for (let key in data) if (data[key] === '') delete data[key];
  axiosInstance.defaults.headers['Content-Type'] = ct=='json'?'application/json;charset=utf-8':'application/x-www-form-urlencoded;charset:utf-8'
  if (method == 'post') {
    return axiosInstance.post(url, data)
  } else if (method == 'get') {
    return axiosInstance.get(url, { params: data })
  } else if (method == 'delete') {
    return axiosInstance.delete(url, { params: data })
  } else if (method == 'put') {
    return axiosInstance.put(url, data)
  } else {
    console.error('未知的method' + method)
    return false
  }
}
  