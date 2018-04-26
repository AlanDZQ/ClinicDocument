import request from '@/utils/request'
// const ip = 'http://192.168.0.15:5000'
// const ip = 'http://121.42.252.18:5000'
const ip = ''

export function adminLogin(username, password) {
  return request({
    url: ip + '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function adminGetInfo(token) {
  return request({
    url: ip + '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function adminLogout() {
  return request({
    url: ip + '/admin/logout',
    method: 'post'
  })
}

export function userLogin(username, password) {
  return request({
    url: ip + '/app/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function userGetInfo(userId) {
  return request({
    url: ip + '/app/getUserInfo',
    method: 'get',
    params: { userId }
  })
}
