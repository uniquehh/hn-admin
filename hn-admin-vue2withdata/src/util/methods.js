import request from './myAxios';
import vm from '@/main';
import { MessageBox, Message } from "element-ui";

const methods = {
  // 清除顶部菜单相关缓存
  removeTopMenuStorage(){
    localStorage.removeItem('topMenus')
    localStorage.removeItem('currentPath') 
  },
  // 退出登录
  loginOut(){
    methods.removeTopMenuStorage()
    localStorage
    // localStorage.removeItem('userInfo')
    // localStorage.removeItem('mianBaos')
    // localStorage.removeItem('isLogin')
    localStorage.clear()
    // location.href = '/'
    // vm.$store.commit('stSetUserInfo',{})
    window.location.reload()//刷新页面重置vuex的值
    vm.$router.replace({ path: '/login',query:{logout:true} })
  },
  // 请求数据
  request,
  // 提示框
  hnMsgBox(text = "确定执行此操作吗？", type = "danger") {
    return MessageBox.confirm(text, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: type
    });
  },
  // msg提示
  hnMsg(message = "操作成功", type = "success",duration=3000) {
    // type:success/warning/info/error
    return Message({
      showClose: true,
      message,
      type,
      duration
    });
  },
  // 处理面包屑
  handleMianBao(current='/index'){
    let mbtemp = []
    let asideMenus = vm.$store.state.asideMenu.asideMenus
    for (let i = 0; i < asideMenus.length; i++){
      if (asideMenus[i].child.length) {
        for (let j = 0; j < asideMenus[i].child.length; j++){
          if(current==asideMenus[i].child[j].path){
            mbtemp.push(asideMenus[i])
            mbtemp.push(asideMenus[i].child[j])
            break
          }
        }
      } else {
        if(asideMenus[i].path==current){
          mbtemp.push(asideMenus[i])
          break
        }
      }
    }
    vm.$store.commit('mianBaoXie/stSetMianBaos', mbtemp)
  },
  // 侧边栏菜单点击处理
  handleAsideMenu(path) {
    vm.$store.commit('topMenu/stSetTopCurrent', path)
    let topMenus = vm.$store.state.topMenu.topMenus
    let asideMenus = vm.$store.state.asideMenu.asideMenus
    // 判断历史菜单记录中是否已经有了该菜单数据
    let temp = topMenus.find(item=>item.path==path)
    if(temp)return;
    // 对比path，找到新激活的菜单数据
    for (let i = 0; i < asideMenus.length; i++){
      if (asideMenus[i].child.length) {
        for (let j = 0; j < asideMenus[i].child.length; j++){
          if (path == asideMenus[i].child[j].path) {
            topMenus.push(asideMenus[i].child[j])
            break
          }
        }
      } else {
        if (asideMenus[i].path == path) {
          topMenus.push(asideMenus[i])
          break
        }
      }
    }
    // 把处理好的数据用store存储在topmenu中
    vm.$store.commit('topMenu/stSetTopMenus', topMenus)
  },
  //路由跳转
  hnRouterPush(par) {
    if (typeof par == 'object'&& par.hasOwnProperty('query')) {
      vm.$router.push({ path:par.path,query:par.query})
    } else if (typeof par == 'object' && par.hasOwnProperty('params')) {
      vm.$router.push({ path:par.path,params:par.params})
    } else if (typeof par == 'string') {
      vm.$router.push(par)
    } else {
      methods.hnMsg("函数参数处理错误",'info')
    }
  },
  hnRouterRep(par) {
    if (typeof par == 'object'&& par.hasOwnProperty('query')) {
      vm.$router.replace({ path:par.path,query:par.query})
    } else if (typeof par == 'object' && par.hasOwnProperty('params')) {
      vm.$router.replace({ path:par.path,params:par.params})
    } else if (typeof par == 'string') {
      vm.$router.replace(par)
    } else {
      methods.hnMsg("函数参数处理错误",'info')
    }
  },
  hnRouterGo(par=-1) {
    // -1 后退一页 ，1前进一页
    vm.$router.go(par)
  },
  // 将后端返回来的菜单数据与本地数据对比处理出有权限的菜单数据
  hasPowerAsideMenus() {
    let asideMenus = vm.$store.state.asideMenu.asideMenus
    // console.log()
    asideMenus.forEach((item) => {
      if (item.child.length&&item.needPower) {
        item.hasPower = methods.hasPower(item.sign)//父节点也要做权限判断
        if (item.hasPower) {//父级有权限才对子级进行判断
          item.child.forEach((items) => {
            if (items.needPower) {
              items.hasPower = methods.hasPower(items.sign)
            }
          })
        }
      } else if(item.needPower) {
        if (item.needPower) { 
          item.hasPower = methods.hasPower(item.sign)
        }
      }
    })
    console.log(asideMenus,8080)
    vm.$store.commit('asideMenu/stSetasideMenus', asideMenus)
  },
  // 判断当前用户是否有某个菜单的权限
  hasPower(sign) {
    // sign 是和后端约定好的菜单标识
    let userInfo = vm.$store.state.user.userInfo
    // console.log(userInfo.roleVo.menuNames.includes(sign),sign)
    return userInfo.roleVo.menuNames.includes(sign)
  },
  // 获取所有菜单数据
  getMenusAll() {
    return methods.request('/authority/getAllMenuList')
  },
  // 获取所有角色数据
  getRolesAll() {
    return methods.request('/authority/getAllRoleList')
  },
  
}

export default methods