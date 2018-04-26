export const login = [
  {
    path: '/app/login',
    type: 'post',
    data: {
      result: 'success',
      // result: 'failure',
      // errorMessage: '123',
      user: {
        userId: 1,
        userName: 'ZWH',
        email: '12392882@qq.com'
      }
    }
  },
  {
    path: /\/app\/getUserInfo\?userId=\d/,
    type: 'get',
    data: {
      result: 'success',
      user: {
        userName: '123',
        email: '123@qq.com',
        userId: 1
      }
    }
  },
  {
    path: '/admin/login',
    type: 'post',
    data: {
      result: 'success',
      token: 'admin'}
  },
  {
    path: '/admin/logout',
    type: 'post',
    data: {result: 'success'}
  },
  {
    path: '/admin/info?token=admin',
    type: 'get',
    data: {
      result: 'success',
      roles: ['admin'],
      role: ['admin'],
      name: 'admin',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    }
  }
]
