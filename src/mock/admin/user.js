import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    username: '@name',
    password: /[a-zA-Z]+[a-zA-Z0-9]{4,10}/,
    email: '@email',
    tel: /13[123569]{1}\d{8}|15[1235689]\d{8}|188\d{8}/,
    'status|1': ['enabled', 'disabled']
  }))
}

export default {
  getList: config => {
    // console.log(config)
    const { email, tel, username, password, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (email && item.email.indexOf(email) < 0) return false
      if (tel && item.tel !== tel) return false
      if (password && item.password !== password) return false
      if (username && item.username.indexOf(username) < 0) return false
      return true
    })

    if (sort === '-id') {
      // 倒序
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  createUser: config => {
    let body = JSON.parse(config.body)
    // console.log(body)
    const username = body.username
    let mockList = List.filter(item => {
      if (username && item.username !== username) return false
      return true
    })
    if (mockList.length === 0) {
      // alert(List.reverse()[0].id)
      body.id = (List.reverse()[0].id + 1)
      List.unshift(body)
      return {
        result: 'success',
        id: body.id
      }
    }
    if (mockList.length > 0) {
      return {
        result: 'failure',
        errorMessage: 'Exsiting user name'
      }
    }
  },
  updateUser: () => ({
    result: 'success'
  }),
  deleteUser: config => {
    let body = JSON.parse(config.body)
    // console.log(body)
    // console.log(body)
    for (let i = 0, len = List.length; i < len; ++i) {
      if (List[i].id === body.id) {
        List.splice(i, 1)
        return {
          result: 'success'
        }
      }
    }
    return {
      result: 'failure',
      errorMessage: 'No this user'
    }
  }
}
