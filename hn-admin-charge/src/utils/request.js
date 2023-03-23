import axios from 'axios'
import {
  Notification,
  MessageBox,
  Message,
  Loading
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import {
  tansParams,
  blobValidate
} from "@/utils/ruoyi";
import cache from '@/plugins/cache'
import {
  saveAs
} from 'file-saver'

// --------------------------------------------


import qs from 'qs'
// import da from "element-ui/src/locale/lang/da";
// import manage from './manage.js'
// axios.defaults.baseURL = manage.apiHost;
// import { getToken,clear } from '@/utils/auth'
axios.defaults.timeout = 60 * 1000 * 10;
// axios.defaults.cache = false

// console.log("当前环境",process.env.NODE_ENV);

// /*第一层if判断生产环境和开发环境*/
// if (process.env.NODE_ENV === 'production') {
//     /*第二层if，根据.env文件中的VUE_APP_FLAG判断是生产环境还是测试环境*/
//     if (process.env.VUE_APP_FLAG === 'pro') {
//         //production 生产环境
//         axios.defaults.baseURL = 'http://127.0.0.1:8080';
//     } else {
//         //test 测试环境
//         axios.defaults.baseURL = 'http://127.0.0.1:8080';
//     }
// } else {
//     //dev 开发环境
//     // axios.defaults.baseURL = 'http://127.0.0.1:8080';
// }
//
// let baseUrl = axios.defaults.baseURL;
//
// console.log("当前host：", baseUrl);

axios.interceptors.request.use(
  config => {
    // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    // config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    // config.data = qs.stringify(manage.data)
    // config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    // config.headers['Authorization'] = getToken() ? getToken() : null;
    // manage.headers['X-CSRFToken'] = sessionStorage.getItem('csrftoken');
    // config.headers['Cookie'] = 'Hm_lvt_b0668f30d62e1597bdb36d05edea8960=1604221499,1604560772,1604655241; Hm_lpvt_b0668f30d62e1597bdb36d05edea8960=1604911501; sid=f2295ce4-5905-47d2-b119-9747e7749674';
    return config;
  },
  error => {
    return Promise.reject(error);

  }
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

function checkStatus(response) {
  if (response.status === 200 || response.status === 304) {
    return response['data'];
  } else {
    throw new Error(response.data.message); // eslint-disable-line
  }
  throw new Error(response.statusText); // eslint-disable-line
}

export function request(config) {
  return axios.request(config).then(checkStatus);
}

export function get(url, params) {
  // let queryData = Object.assign(params, {t: new Date().getTime()})
  return axios.get(url, {
    params
  }).then(checkStatus);
}

export function getPageList(url, query) {
  let queryData = Object.assign(query, {});
  return axios.get(url, queryData).then(checkStatus);
}

export function delet(url, params) {
  return axios.delete(url, params).then(checkStatus);
}

export function post(url, data, config) {
  return axios.post(url, qs.stringify(data), config).then(checkStatus);
}

export function postDefine(url, data, config) {
  return axios.post(url, data, config).then(checkStatus);
}

export function postData(url, data, config) {
  return axios.post(url, data, config).then(checkStatus);
}

export function put(url, data, config) {
  return axios.put(url, data, config).then(checkStatus);
}

export function patch(url, data, config) {
  return axios.patch(url, data, config).then(checkStatus);
}



// ---------------------------------------------

let downloadLoadingInstance;
// 是否显示重新登录
export let isRelogin = {
  show: false
};

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 6000
})


// service.getPageList = getPageList;
// service.delet = delet;
// service.get = get;
// service.post = post;
// service.postData = postData;
// service.patch = patch;
// service.put = put;
// request拦截器
service.interceptors.request.use(config => {
  config.headers['PLATFORM'] = 'pc';
  // 是否需要设置 token
  const isToken = (config.headers || {}).isToken === false
  // 是否需要防止数据重复提交
  const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
  if (getToken() && !isToken) {
    config.headers['token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  // get请求映射params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?' + tansParams(config.params);
    url = url.slice(0, -1);
    config.params = {};
    config.url = url;
  }
  // if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
  //   const requestObj = {
  //     url: config.url,
  //     data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
  //     time: new Date().getTime()
  //   }
  //   const sessionObj = cache.session.getJSON('sessionObj')
  //   if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
  //     cache.session.setJSON('sessionObj', requestObj)
  //   } else {
  //     const s_url = sessionObj.url; // 请求地址
  //     const s_data = sessionObj.data; // 请求数据
  //     const s_time = sessionObj.time; // 请求时间
  //     const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
  //     if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
  //       const message = '数据正在处理，请勿重复提交';
  //       console.warn(`[${s_url}]: ` + message)
  //       return Promise.reject(new Error(message))
  //     } else {
  //       cache.session.setJSON('sessionObj', requestObj)
  //     }
  //   }
  // }
  return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 1;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (code === -1||code === 4005) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          isRelogin.show = false;
          store.dispatch('LogOut').then(() => {
            location.href = '/index';
          })
        }).catch(() => {
          isRelogin.show = false;
        });
      }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 4001) {
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject(new Error(msg))
    } else if (code !== 1) {
      // Notification.error({
      // 	title: msg
      // })
      Message({
        message: msg,
        type: 'error'
      })
      return Promise.reject('error')
    } else {
      return res.data
    }
  },
  error => {
    let isShowError=false;
        let {
          message
        } = error;
        if (message == "Network Error") {
          isShowError=true;
          message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
          isShowError=true;
          message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
          isShowError=true;
          message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        // console.log("000000000000000000",error);
        if(isShowError){

          // console.log("1111111111111111111111",error);
          isShowError=false;
          Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
          })
          return Promise.reject(error)
        }else{

          // console.log("222222222222222222222",error);
            return Promise.resolve()
        }
  }
)

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
  return service.post(url, params, {
    //transformRequest: [(params) => { return tansParams(params) }],
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export function HttpGetDown(url, params, filename) {
  downloadLoadingInstance = Loading.service({
    text: "正在下载数据，请稍候",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  })
  return service.get(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then(async (data) => {
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export default service
