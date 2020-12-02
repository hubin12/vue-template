import request from '@/utils/request'

export function generatorSql(data) {
  return request({
    url: '/api/generatorSql',
    method: 'post',
    data
  })
}

export function generatorJava(data) {
  return request({
    url: '/api/generatorJava',
    method: 'post',
    data
  })
}

export function listTables(data) {
  return request({
    url: '/api/listTables',
    method: 'post',
    data
  })
}

export function listDataBases(data) {
  return request({
    url: '/api/listDataBases',
    method: 'post',
    data
  })
}
