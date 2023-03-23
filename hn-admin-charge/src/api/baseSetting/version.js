import request from '@/utils/request'

export function getVersionById(id){
  return request({
    url: '/version/'+id,
    method: 'get'
  })
}

export function saveVersion(data){
  return request({
    url: '/version',
    method: 'put',
    data:data
  })
}

