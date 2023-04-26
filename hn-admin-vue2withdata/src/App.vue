<template>
  <div id="app">
    <router-view/>
    <!-- 按钮模板 -->
    <!-- <el-button  icon="el-icon-upload">导出全部</el-button> -->
    <!-- <el-button  icon="el-icon-plus" type="primary">新增企业</el-button> -->
    <!-- <el-button >重置</el-button> -->
    <!-- <el-button  type="primary">搜索</el-button> -->
    <!-- <el-button  icon="el-icon-search" type="primary">搜索</el-button> -->
    <!-- <el-date-picker v-model="value" type="date" placeholder="请选择日期"></el-date-picker> -->
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
    this.stSetTopCurrent(this.$route.path)
    this.handleMianBao(this.$route.path)
    this.handleAsideMenu(this.$route.path)
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
  color: #333;
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
// .hn-jdzxmh-center{
//   ::v-deep .el-switch__label *{
//     font-size: 18px !important;
//   }
// }
</style>
