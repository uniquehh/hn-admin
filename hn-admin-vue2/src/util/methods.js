import request from './myAxios'
const methods = {
  // 清除顶部菜单相关缓存
  removeTopMenuStorage(){
    sessionStorage.removeItem('topMenus')
    sessionStorage.removeItem('currentPath') 
  },
  // 退出登录
  loginOut(){
    methods.removeTopMenuStorage()
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('mianBaos')
    sessionStorage.removeItem('isLogin')
    this.$router.push({path:'/login'})
  },
  // 请求数据
  request,
  
}

export default methods