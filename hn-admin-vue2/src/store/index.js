import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: {
      state: {
        userInfo: {},
        isLogin:false
      },
      getters: {

      },
      mutations: {
        stSetUserInfo(state,val) {
          state.userInfo = val
        },
        stSetLoginStatus(state,val) {
          state.isLogin = val
        },
      },
      actions: {

      },
    },
  }
})
