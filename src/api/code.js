import request from '@/utils/request'

export function generatorSql(data) {
  return request({
    url: '/api/generatorSql',
    method: 'post',
    data
  })
}

export function download(param) {
  return request({
    url: '/api/download',
    method: 'get',
    param: param
  })
}
