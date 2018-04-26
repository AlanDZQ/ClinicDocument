import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import administrator from './modules/administrator'
import user from './modules/user'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    administrator,
    user
  },
  getters,
  actions
})

export default store
