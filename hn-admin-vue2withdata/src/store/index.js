import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 本地设置的菜单数据--sign字段和后端约定，用于与后端返回的菜单数据做对比处理
// needPower 字段表示是否需要权限,true表明需要做权限判断-不需要权限则默认有权限
// hasPower 表示当前是否有该菜单的权限，默认false-没有权限
var asideMenus = [
  {
    id: "0", name: "首页", path: '/index',needPower:false,hasPower:true,sign:"INDEX",icon:"el-icon-s-home",showAside:true,child: []
  },
  {
    id: "1", name: "成单管理", path: '/cdAdmin',needPower:true,hasPower:false,sign:"ORDER_MANAGER",icon:"el-icon-s-claim",showAside:true,child: []
  },
  {
    id: "2", name: "客户海", path: '/customerRecb',needPower:true,hasPower:false,sign:"CUSTOM_SEA",icon:"el-icon-kehuguanli",showAside:true,child: []
  },
  {
    id: "3", name: "医院派单", path: '/yiYuanPaiDan',needPower:true,hasPower:false,sign:"HOSPITAL_DISPATCH_MANAGER",icon:"el-icon-yiyuan",showAside:true,child: []
  },
  {
    id: "4", name: "我的客户", path: '/myCustomer',needPower:true,hasPower:false,sign:"CUSTOM_MANAGER",icon:"el-icon-kehu",showAside:true,child: []
  },
  // {
  //   id: "5", name: "派单管理", path: '/paiDanAdmin',needPower:true,hasPower:false,sign:"DISPATCH_MANAGER",icon:"el-icon-yunliankeji-",showAside:true,child: []
  // },
  {
    id: "6", name: "个人中心", path: '/personal',needPower:false,hasPower:true,sign:"PERSONAL",icon:"el-icon-user",showAside:false,child: []
  },
  {
    id: "7", name: "客户详情", path: '/customerInfo',needPower:false,hasPower:true,sign:"CUSTOMERINFO",icon:"el-icon-kehu",showAside:false,child: []
  },
  {
    id: "8", name: "接单中心", path: '/jieDanZhongXin',needPower:false,hasPower:true,sign:"JDZX",icon:"el-icon-s-order",showAside:false,child: []
  },
  {
    id: "9", name: "系统管理", path: '/system/index',needPower:true,hasPower:false,sign:"SYSTEM_MANAGER",icon:"el-icon-s-tools",showAside:true, child: [
      { id: "9-1", name: "医院管理", path: '/system/yiYuanUserAdmin',needPower:true,hasPower:false,sign:"HOSPITAL_MANAGER",icon:"el-icon-yiyuan1",showAside:true, child: [] },
      { id: "9-2", name: "用户管理", path: '/system/staffAdmin',needPower:true,hasPower:false,sign:"USER_MANAGER",icon:"el-icon-guanlikehu",showAside:true, child: [] },
      { id: "9-3", name: "客户管理", path: '/system/customeAdmin',needPower:true,hasPower:false,sign:"ALL_CUSTOM_MANAGER",icon:"el-icon-navicon-grkh",showAside:true, child: [] },
      { id: "9-4", name: "小组管理", path: '/system/groupAdmin',needPower:true,hasPower:false,sign:"GROUP_MANAGER",icon:"el-icon-s-management",showAside:true, child: [] },
      { id: "9-5", name: "数据字典", path: '/system/dataDict',needPower:true,hasPower:false,sign:"DICT_MANAGER",icon:"el-icon-shujuzidian-jianying", child: [] },
      { id: "9-6", name: "权限管理", path: '/system/powerAdmin',needPower:true,hasPower:false,sign:"AUTHORITY_MANAGER",icon:"el-icon-quanxian",showAside:true, child: [] },
    ] 
  },
]
// localStorage无法存储复杂数据类型，所以存储和取出都要转化为json字符串和对象
export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      state: {
        userInfo:JSON.parse(localStorage.getItem("userInfo"))||{},
        isLogin:localStorage.getItem("isLogin")||false
      },
      getters: {

      },
      mutations: {
        stSetUserInfo(state,val) {
          state.userInfo = val
          localStorage.setItem("userInfo",JSON.stringify(val))
        },
        stSetIsLogin(state,val) {
          state.isLogin = val
          localStorage.setItem("isLogin",val)
        },
      },
      actions: {

      },
    },
    asideMenu: {
      namespaced: true,
      state: {
        isCollapse: false,//侧边栏的展开折叠
        asideMenus:JSON.parse(localStorage.getItem("asideMenus"))||asideMenus,
      },
      mutations: {
        stSetCollapse(state,val) {
          state.isCollapse = val
        },
        stSetasideMenus(state,val) {
          state.asideMenus = val
          asideMenus = val
          localStorage.setItem("asideMenus",JSON.stringify(val))
        },
      },
    },
    firstPath: {
      namespaced: true,
      state: {
        firstPath: JSON.parse(localStorage.getItem("firstPath"))||"",//侧边栏第一个菜单可跳转的path
      },
      mutations: {
        stSetFirstPath(state,val) {
          state.firstPath = val
          localStorage.setItem('firstPath',JSON.stringify(val))
        },
      },
    },
    topMenu: {
      namespaced: true,
      state: {
        topMenus:JSON.parse(localStorage.getItem("topMenus"))||[],//顶部激活的历史菜单集合
        current:localStorage.getItem("currentPath")||"",//当前激活的菜单path
      },
      mutations: {
        stSetTopMenus(state,val) {
          state.topMenus = val
          localStorage.setItem("topMenus",JSON.stringify(val))
        },
        stSetTopCurrent(state,val) {
          state.current = val
          localStorage.setItem("currentPath",val)
        },
      },
    },
    mianBaoXie: {
      namespaced: true,
      state: {
        mianBaos:JSON.parse(localStorage.getItem("mianBaos"))||[],
      },
      mutations: {
        stSetMianBaos(state,val) {
          state.mianBaos = val
          localStorage.setItem("mianBaos",JSON.stringify(val))
        },
      },
    },
    personal: {
      namespaced: true,
      state: {
        showDialog:false,
      },
      mutations: {
        stSetPsonDialog(state,val) {
          state.showDialog = val
        },
      },
    },



  }
})
