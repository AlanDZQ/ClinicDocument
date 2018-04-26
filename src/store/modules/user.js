import { userLogin, userGetInfo } from '@/api/login'
import { getUserId, setUserId, removeUserId } from '@/utils/auth'

const user = {
  state: {
    // token: getToken(),
    userId: getUserId(),
    userName: '',
    email: ''
  },

  mutations: {
    // SET_TOKEN: (state, token) => {
    //   state.token = token
    // },
    SET_USERNAME: (state, name) => {
      state.userName = name
    },
    SET_USERID: (state, id) => {
      state.userId = id
    },
    SET_USEREMAIL: (state, email) => {
      state.email = email
    }
  },

  actions: {
    // 登录
    UserLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        userLogin(username, userInfo.password).then(response => {
          const data = response.data
          if (data.result === 'success') {
            setUserId(data.user.userId)
            commit('SET_USERID', data.user.userId)
            commit('SET_USERNAME', data.user.userName)
            commit('SET_USEREMAIL', data.user.email)
            // alert(data.user.userId)
            resolve()
          } else {
            reject(data.errorMessage)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    UserGetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        userGetInfo(state.userId).then(response => {
          const data = response.data
          if (data.result === 'success') {
            commit('SET_USERID', data.user.userId)
            commit('SET_USERNAME', data.user.userName)
            commit('SET_USEREMAIL', data.user.email)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token).then((response) => {
    //       const data = response.data
    //       if (data.result === 'success') {
    //         commit('SET_TOKEN', '')
    //         commit('SET_ROLES', [])
    //         removeToken()
    //         resolve()
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 前端 登出
    UserFedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_UserId', '')
        removeUserId()
        resolve()
      })
    }
  }
}

export default user
