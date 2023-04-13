<template>
  <div id="app">
    <router-view/>
    <!-- 按钮模板 -->
    <!-- <el-button size="small" icon="el-icon-upload">导出全部</el-button> -->
    <!-- <el-button size="small" icon="el-icon-plus" type="primary">新增企业</el-button> -->
    <!-- <el-button size="small">重置</el-button> -->
    <!-- <el-button size="small" type="primary">搜索</el-button> -->
    <!-- <el-button size="small" icon="el-icon-search" type="primary">搜索</el-button> -->
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
    // ...mapState('user', ['userInfo','isLogin']),
    ...mapState('topMenu', ['topMenus', 'current']),
  },
  mounted() {
    
  },
  updated() { 
    // console.log(this.$route)
    this.stSetTopCurrent(this.$route.fullPath)
    this.handleMianBao(this.$route.fullPath)
  },
  beforeDestroy() {
    // 关闭页面前清除顶部菜单缓存数据--下次进入页面自动跳转首页
    this.removeTopMenuStorage()
  },
  methods: {
    ...mapMutations('topMenu', ['stSetTopMenus', 'stSetTopCurrent']),
  }
}
</script>

<style lang="scss">
/* 主题颜色 #409EFF */
@import '@/assets/css/hncss.scss';
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
.el-input{
  width: unset !important;
}
</style>
