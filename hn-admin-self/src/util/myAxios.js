import axios from 'axios'
import baseURL from './config'

let axiosInstance = axios.create({
  baseURL: baseURL.APIURL,
  timeout: 6000,
  headers: {'Content-Type': 'application/json;charset=utf-8'}
})

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  // 每个请求都携带token
  if (sessionStorage.getItem('token')) {
    config.headers['token'] = sessionStorage.getItem('token')
  }

  if (config.method == 'post') {
    
  }
  return config;
}, (error) => {
  return Promise.reject(error);
})
  
// 响应拦截器
axiosInstance.interceptors.response.use((res) => {
  return res.data
}, (error) => {
  return Promise.reject(error);
})

export default function req (url,data = {},method = 'get') {
  method = method.toLowerCase();//统一将方法转换为小写字母
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
  