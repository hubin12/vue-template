import request from '@/utils/request'

export function code() {
  return request({
    url: '/api/code',
    method: 'post',
    params: {}
  })
}

export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/getUserInfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
