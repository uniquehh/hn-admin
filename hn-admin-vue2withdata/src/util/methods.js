import request from './myAxios'
import vm from '@/main'
const methods = {
  // 清除顶部菜单相关缓存
  removeTopMenuStorage(){
    sessionStorage.removeItem('topMenus')
    sessionStorage.removeItem('currentPath') 
  },
  // 退出登录
  loginOut(){
    methods.removeTopMenuStorage()
    // sessionStorage.removeItem('userInfo')
    // sessionStorage.removeItem('mianBaos')
    // sessionStorage.removeItem('isLogin')
    sessionStorage.clear()
    // vm.$store.commit('stSetUserInfo',{})
    window.location.reload()//刷新页面重置vuex的值
    vm.$router.replace({ path: '/login' }) //replace跳转防止用户返回
  },
  // 请求数据
  request,
  
}

export default methods