import { adminLogin, adminLogout, adminGetInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const administrator = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    AdminLogin({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        adminLogin(username, userInfo.password).then(response => {
          const data = response.data
          if (data.result === 'success') {
            setToken(data.token)
            commit('SET_TOKEN', data.token)
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    AdminGetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        adminGetInfo(state.token).then(response => {
          const data = response.data
          if (data.result === 'success') {
            commit('SET_ROLES', data.roles)
            commit('SET_NAME', data.name)
            commit('SET_AVATAR', data.avatar)
            resolve(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    AdminLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        adminLogout(state.token).then((response) => {
          const data = response.data
          if (data.result === 'success') {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    AdminFedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default administrator
