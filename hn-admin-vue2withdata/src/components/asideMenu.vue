<template>
  <div class="hn-aside-menu">
    <div class="hn-aside-title" @click="hnRouterPush('/index')">
      <img src="../assets/img/defAvatar.png" alt="">
      <span v-show="!isCollapse">管理系统</span>
    </div>
    <div class="hn-menus-box">
      <el-menu
        class="new-el-menu--sidebar"
        :default-active="current"
        :collapse-transition="true"
        :collapse="isCollapse"
        text-color="#F6F6F6"
        active-text-color="#ffffff"
        background-color="#202124"
        router
      >
        <template v-for="(item) in asideMenus">
          <!-- 有子菜单才渲染dom -->
            <el-submenu :key="item.path + 'smenu'" :index="item.path" v-if="item.child.length>0 && item.hasPower&& item.showAside">
              <template #title>
                <i :class="item.icon"></i>
                <span :title="item.name">{{ item.name }}</span>
              </template>
              <template v-for="(items) in item.child">
                <el-menu-item v-if="items.hasPower" :key="items.path" :index="items.path">
                  <i :class="items.icon"></i>
                  <span :title="items.name">{{ items.name }}</span>
                </el-menu-item>
              </template>
            </el-submenu>
            <!-- 无子菜单才渲染的dom -->
            <el-menu-item v-if="!item.child.length&&item.hasPower&&item.showAside" :key="item.path + 'menu'" :index="item.path">
              <i :class="item.icon"></i>
              <span :title="item.name">{{ item.name }}</span>
            </el-menu-item>
        </template>
      </el-menu>
    </div>
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
    ...mapState('asideMenu',['isCollapse','asideMenus']),
    ...mapState('topMenu',['topMenus','current']),
  },
  mounted() {

  },
  methods: {
    // 用store管理topmenu
    ...mapMutations('topMenu',['stSetTopMenus','stSetTopCurrent']),
    // 面包屑
    ...mapMutations('mianBaoXie',['stSetMianBaos']),


  }
}

</script>

<style scoped>
.new-el-menu--sidebar:not(.el-menu--collapse) {
  width: 220px;
}
.hn-aside-title{
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 15px 0;
  cursor: pointer;
}
.hn-aside-title img{
  width: 30px;
  height: 30px;
}
.hn-menus-box{
  margin-right: -17px;
  overflow-y: scroll;
  max-height: calc(100vh - 60px);
  overflow-x: hidden;
}
.el-menu{
  max-width: 200px;
  border: none;
}

/* .el-menu-item{
  
} */
.el-menu-item span{
  display: inline-block;
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
.el-submenu__title span {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 10px;
}
.new-el-menu--sidebar .is-active{
  background-color: #409EFF !important;
}
</style>
