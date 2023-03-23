import request from '@/utils/request'

// 获取项目信息
export function getProject() {
  return request({
    url: '/system/project/getAll',
    method: 'get'
  })
}

// 获取司机信息
export function getDriverList(data) {
  return request({
    url: '/system/driver/queryList',
    method: 'get',
    params:data
  })
}

// 获取其中一条数据详情
export function getListOneInfo(id) {
  return request({
    url: `/system/driver/queryById/${id}`,
    method: 'get',
  })
}

// 修改数据
export function updataListOneInfo(data) {
  return request({
    url: '/system/driver/update',
    method: 'post',
    data:data
  })
}

// 添加数据
export function addListOneInfo(data) {
  return request({
    url: '/system/driver/create',
    method: 'post',
    data:data
  })
}

// 冻结解冻用户
export function freezeThaw(id) {
  return request({
    url: `/system/driver/updateStatus/${id}`,
    method: 'post',
  })
}

// 重置用户密码
export function resetPassword(id) {
  return request({
    url: `/system/driver/resetPassword/${id}`,
    method: 'post',
  })
}

// 获取司机所属车辆信息
export function getDriverOwnerList(data) {
  return request({
    url: '/system/driver/queryCarList',
    method: 'get',
    params:data
  })
}