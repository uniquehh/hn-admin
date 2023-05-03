import request from './myAxios';
import vm from '@/main';
import { MessageBox, Message } from "element-ui";

const methods = {
  // 关闭网页后需要清除的缓存
  removeLocalStorage(){
    localStorage.removeItem('topMenus')
    localStorage.removeItem('currentPath') 
    localStorage.removeItem('mianBaos') 
    localStorage.removeItem('topMenus') 
    localStorage.removeItem('chinaArea') 
    localStorage.removeItem('customId') 
    localStorage.removeItem('firstPath') 
  },
  // 退出登录
  loginOut(req=true){
    if(req){
      methods.request("/auth/logout",{},'post').then((res)=>{
        if(res.code==0){
          methods.removeLocalStorage()
          // localStorage.removeItem('userInfo')
          // localStorage.removeItem('mianBaos')
          // localStorage.removeItem('isLogin')
          localStorage.clear()
          location.href = '/login'
          // vm.$store.commit('stSetUserInfo',{})
          window.location.reload()//刷新页面重置vuex的值
          // methods.hnRouterPush('/login')
          // vm.$router.replace({ path: '/login',query:{logout:true} })
        }
      })
    }else{
      methods.removeLocalStorage()
      localStorage.clear()
      window.location.reload()//刷新页面重置vuex的值
      location.href = '/login'
      // methods.hnRouterPush('/login')
      // vm.$router.replace({ path: '/login',query:{logout:true} })
    }
  },
  // 请求数据
  request,
  // 提示框
  hnMsgBox(text = "操作后无法恢复，确定执行此操作吗？", type = "danger") {
    return MessageBox.confirm(text, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: type
    });
  },
  hnMsgBox2(text = "用户信息变更，需要重新登录！", type = "danger") {
    return MessageBox.confirm(text, "提示", {
      confirmButtonText: "确定",
      showCancelButton:false,
      type: type,
      closeOnClickModal:false,
      closeOnPressEscape:false,
      showClose:false,
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
    let curr = vm.$route.path
    if (typeof par == 'object'&& par.hasOwnProperty('query')) {
      if(curr==par.path)return;
      vm.$router.push({ path:par.path,query:par.query})
    } else if (typeof par == 'object' && par.hasOwnProperty('params')) {
      if(curr==par.path)return;
      vm.$router.push({ path:par.path,params:par.params})
    } else if (typeof par == 'string') {
      if(curr==par)return;
      vm.$router.push(par)
    } else {
      methods.hnMsg("函数参数处理错误",'info')
    }
  },
  hnRouterRep(par) {
    let curr = vm.$route.path
    if (typeof par == 'object'&& par.hasOwnProperty('query')) {
      if(curr==par.path)return;
      vm.$router.replace({ path:par.path,query:par.query})
    } else if (typeof par == 'object' && par.hasOwnProperty('params')) {
      if(curr==par.path)return;
      vm.$router.replace({ path:par.path,params:par.params})
    } else if (typeof par == 'string') {
      if(curr==par)return;
      vm.$router.replace(par)
    } else {
      methods.hnMsg("函数参数处理错误",'info')
    }
  },
  hnRouterBack() {
    vm.$router.back()
  },
  // 将后端返回来的菜单数据与本地数据对比处理出有权限的菜单数据
  hasPowerAsideMenus() {
    let asideMenus = vm.$store.state.asideMenu.asideMenus
    let userInfo = vm.$store.state.user.userInfo

    asideMenus.forEach((item) => {
      // 医院用户不显示首页
      if(userInfo.roleVo.roleLevel==4&&item.path=='/index'){
        item.needPower = true
        item.hasPower = false
        item.showAside = false
      }

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
    // console.log(asideMenus,8080)
    // 侧边栏第一个可跳转的有权限的path
    let haspower = asideMenus.find(item=>item.hasPower==true)
    let pt = haspower.child.length>0?haspower.child[0].path:haspower.path
    vm.$store.commit('firstPath/stSetFirstPath',pt)
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
    return new Promise((rs,rj) => {
      methods.request('/authority/getAllMenuList').then((res) => {
        if (res.code == 0) {
          rs(res)
        } else {
          rj(res)
        }
      })
    })
  },
  // 获取所有角色数据
  getRolesAll() {
    return new Promise((rs,rj) => {
      methods.request('/authority/getAllRoleList').then((res) => {
        if (res.code == 0) {
          rs(res)
        } else {
          rj(res)
        }
      })
    })
  },
  // 是否为空
  isEmpty(str) {
    if (str == '' || str == null || str == undefined || JSON.stringify(str) == '[]' || JSON.stringify(str) == '{}') {
      return true;
    } else {
      return false;
    }
  },
  // 获取全国省市区数据
  getChinaAreaList(par={}){
    // level-0 表示查询省级数据，level-1表示市级--默认查省级
    let obj = {level:"0"}
    par = Object.assign(obj,par)
    return new Promise((rs,rj) => {
      methods.request('/chinaArea/getChinaAreaList',par,'post').then((res) => {
        if (res.code == 0) {
          if(par.level=='0'){ //只存省级数据
            res.data.forEach(item=>{
              item.child = []
            })
            window.localStorage.setItem('chinaArea',JSON.stringify(res.data))
          }
          rs(res.data)
        } else {
          rj(res)
        }
      })
    }) 
  },
  // 隐藏部分内容以星号*代替
  replaceStart(str, start, end, isEmail = false, isFixed = 0) {
    if (isEmail) {
      var em = str.split('@');
      str = em[0];
    }
    var s = str.substr(0, start);
    var e = str.substr(str.length - end, str.length - 1);
    var d = '*******************************'.substr(0, isFixed ? isFixed : str.length - start - end);
    if (isEmail) {
      return s + d + e + '@' + em[1];
    }
    return s + d + e;
  },
  // 获取用户信息
  getUserInfo(){
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    return new Promise((rs,rj) => {
      methods.request('/user/getUserDetails',{
        userId:userInfo.id
      },'get','form').then((res) => {
        if (res.code == 0) {
          vm.$store.commit('user/stSetUserInfo', res.data)
          window.localStorage.setItem('userInfo',JSON.stringify(res.data))
          rs(res.data)
        } else {
          rj(res)
        }
      })
    })
  },
  // 获取可选择的同事数据
  getUsableStaff(par={}) {
    return new Promise((rs,rj) => {
      methods.request('/custom/getUserList',par,'post','form').then((res) => {
        if (res.code == 0) {
          rs(res.data)
        } else {
          rj(res)
        }
      })
    })
  },
  // 是否是超管的判断函数
  isChaoGuan(){
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    return userInfo.roleVo.roleLevel==0
  },
  // 简单对象转json--深拷贝
  toJSON(obj){
    return JSON.parse(JSON.stringify(obj))
  },


  
}

export default methods