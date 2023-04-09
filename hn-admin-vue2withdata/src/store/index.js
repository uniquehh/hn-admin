import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 本地设置的菜单数据
var asideMenus = [
  {
    id: "0", name: "首页", path: '/index', child: [] 
  },
  {
    id: "1", name: "系统管理", path: '', child: [
      { id: "1-1", name: "医院用户管理", path: '/system/yiYuanUserAdmin', child: [] },
      { id: "1-2", name: "权限管理", path: '/system/powerAdmin', child: [] },
      { id: "1-3", name: "数据字典", path: '/system/dataDict', child: [] },
      { id: "1-4", name: "员工管理", path: '/system/staffAdmin', child: [] },
    ] 
  },
]
// sessionStorage无法存储复杂数据类型，所以存储和取出都要转化为json字符串和对象
export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      state: {
        userInfo:JSON.parse(sessionStorage.getItem("userInfo"))||{},
        isLogin:sessionStorage.getItem("isLogin")||false
      },
      getters: {

      },
      mutations: {
        stSetUserInfo(state,val) {
          state.userInfo = val
          sessionStorage.setItem("userInfo",JSON.stringify(val))
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
        asideMenus:asideMenus,
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
        menus:JSON.parse(sessionStorage.getItem("topMenus"))||[asideMenus[0]],//顶部激活的历史菜单集合-默认首页
        current:sessionStorage.getItem("currentPath")||"/index",//当前激活的菜单path-默认首页
      },
      mutations: {
        stSetTopMenus(state,val) {
          state.menus = val
          sessionStorage.setItem("topMenus",JSON.stringify(val))
        },
        stSetTopCurrent(state,val) {
          state.current = val
          sessionStorage.setItem("currentPath",val)
        },
      },
    },
    mianBaoXie: {
      namespaced: true,
      state: {
        mianBaos:JSON.parse(sessionStorage.getItem("mianBaos"))||[],
      },
      mutations: {
        stSetMianBaos(state,val) {
          state.mianBaos = val
          sessionStorage.setItem("mianBaos",JSON.stringify(val))
        },
      },
    },
  }
})
