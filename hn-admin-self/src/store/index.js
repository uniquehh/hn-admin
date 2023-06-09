import { createStore } from 'vuex'

export default createStore({
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
    }
  }
})
