import request from '@/utils/request'


export function areaList (query) {
  return request({
    url: '/baseSettingArea/list',
    method:'get',
    params:query
  })
}

export function getDetail (id) {
  return request({
    url: '/baseSettingArea/'+id,
    method: 'get',
  })
}


export function areaConfigList () {
  return request({
    url: '/baseSettingArea/config',
    method:'get',
  })
}


export function addArea(data) {
  return request({
    url: '/baseSettingArea',
    method: 'post',
    data: data
  })
}


export function editStatus(data) {
  return request({
    url: '/baseSettingArea/status',
    method: 'put',
    data: data
  })
}

export function editDefultStatus(id) {
  return request({
    url: '/baseSettingArea/'+id,
    method: 'put',
  })
}
