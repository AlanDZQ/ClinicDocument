import request from '@/utils/request'

// const ip = 'http://192.168.0.15:5000'
// const ip = 'http://121.42.252.18:5000'
const ip = ''
export function fetchList(query) {
  return request({
    url: ip + '/user/list',
    // url: 'http://121.42.252.18:5000/user/list',
    method: 'get',
    params: query
  })
}


export function createUser(data) {
  return request({
    url: ip + '/user/create',
    // url: 'http://121.42.252.18:5000/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: ip + '/user/update',
    // url: 'http://121.42.252.18:5000/user/update',
    method: 'post',
    data
  })
}

export function deleteUser(data) {
  return request({
    url: ip + '/user/delete',
    // url: 'http://121.42.252.18:5000/user/delete',
    method: 'delete',
    data
  })
}
