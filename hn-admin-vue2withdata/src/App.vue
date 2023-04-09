<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('user', ['userInfo','isLogin']),
  },
  mounted() {
    let topmenu = JSON.parse(sessionStorage.getItem("topMenus"))
    let current = sessionStorage.getItem("currentPath")
    if(!topmenu&&!current&&this.isLogin){
      // 页面首次加载默认跳转到首页
      this.$router.push({path:'/index'})
    }else{
      this.$router.push({path:'/login'})
    }
  },
  unmounted() {
    // 关闭页面后清除顶部菜单缓存数据--下次进入页面自动跳转首页
    this.removeTopMenuStorage()
  },
  methods: {
    // ...mapMutations('topMenu',['stSetTopMenus','stSetTopCurrent']),
  }
}
</script>

<style lang="scss">
/* 主题颜色 #409EFF */
@import './assets/css/hncss.scss';
*{margin: 0;padding: 0;text-decoration: none;}
#app{
  overflow: hidden;
}
.page{
  font-size: 14px;
  height: 100%;
  word-break: break-all;
  word-wrap: break-word;
}
.el-menu-item:hover{
  background-color: #409EFF !important;
  color: white !important;
}
.el-menu-item:hover i{
  color: white !important;
}
.el-submenu__title:hover{
  background-color: #409EFF !important;
  color: white !important;
}
.el-submenu__title:hover i{
  color: white !important;
}
.hn-menus-box i{
  color: #fff !important;
}
.el-pagination__jump{
  margin-left: 0px !important;
}
.el-table th.el-table__cell{
  background-color: #FAFAFA !important;
}
</style>
