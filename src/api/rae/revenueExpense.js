import request from '@/utils/request'

// 获取项目信息
export function getProjectAll() {
    return request({
      url: '/system/project/getAll',
      method: 'get'
    })
}

// 获取道路信息
export function getRoadAll() {
    return request({
      url: '/system/road/getAll',
      method: 'get'
    })
}

// 获取可视图数据
export function updataListOneInfo(data) {
    return request({
      url: '/system/statistics/queryMoney',
      method: 'post',
      data:data
    })
  }