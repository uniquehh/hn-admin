import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      state: {
        userInfo: {},
        isLogin:false
      },
      getters: {

      },
      mutations: {
        stSetUserInfo(state,val) {
          state.userInfo = val
          sessionStorage.setItem("userInfo",val)
        },
        stSetIsLogin(state,val) {
          state.isLogin = val
          sessionStorage.setItem("isLogin",val)
        },
      },
      actions: {

      },
    },
    asidMenu: {
      namespaced: true,
      state: {
        isCollapse: false,//侧边栏的展开折叠
      },
      mutations: {
        stSetCollapse(state,val) {
          state.isCollapse = val
        },
      },
    },
    topMenu: {
      namespaced: true,
      state: {
        menus: [],//顶部激活的历史菜单集合
      },
      mutations: {
        stSetTopMenus(state,val) {
          state.menus = val
          sessionStorage.setItem("topMenus",val)
        },
      },
    },
  }
})
