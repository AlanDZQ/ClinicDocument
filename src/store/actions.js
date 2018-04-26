import axios from 'axios'
const actions = {
  // 用户名登录
  LoginByUsername ({ commit }, userInfo) {
    const username = userInfo.username.trim()
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/app/login',
        data: {
          username: username,
          password: userInfo.password
        }
      }).then(res => {
        const data = res.data
        if (data.result === 'success') {
          resolve()
          // 存token等操作
        } else if (data.result === 'failure') {
          reject('Error username or password')
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}
export default actions
