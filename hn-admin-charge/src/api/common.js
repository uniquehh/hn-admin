import request from '@/utils/request'


export function allArea(){
  return request({
    url: '/baseSettingArea/area/list',
    method: 'get'
  })
}

export function imageBase64(data){
  return request({
    url: '/common/upload/base64',
    method: 'post',
    data:data
  })
}
