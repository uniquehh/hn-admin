<template>
  <div class="hn-aside-menu">
    <div class="hn-aside-title">
      <img src="../assets/logo.png" alt="">
      <span v-show="!isCollapse">管理系统</span>
    </div>
    <div class="hn-menus-box">
      <el-menu
        class="new-el-menu--sidebar"
        default-active="/"
        :collapse-transition="true"
        :collapse="isCollapse"
        text-color="#F6F6F6"
        active-text-color="#ffffff"
        background-color="#202124"
        router
      >
        <template v-for="(item) in menus">
          <!-- 有子菜单才渲染 -->
            <el-submenu :key="item.id + 'smenu'" :index="item.id" v-if="item.child">
              <template #title>
                <i class="el-icon-location"></i>
                <span :title="item.title">{{ item.title }}</span>
              </template>
              <el-menu-item v-for="(items) in item.child" :key="items.id" :index="items.path">
                <i class="el-icon-location"></i>
                <span :title="items.title">{{ items.title }}</span>
              </el-menu-item>
            </el-submenu>
            <!-- 无子菜单才渲染 -->
            <el-menu-item :key="item.id + 'menu'" :index="item.path" v-else>
              <i class="el-icon-location"></i>
              <span :title="item.title">{{ item.title }}</span>
            </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      menus: [
        { id: "1", title: "菜单1", path: '/login' },
        {
          id: "2", title: "系统管理", path: '', child: [
            { id: "2-1", title: "医院用户管理", path: '/system/yiYuanUserAdmin' },
            { id: "2-2", title: "权限管理", path: '/system/powerAdmin' },
            { id: "2-3", title: "数据字典", path: '/system/dataDict' },
            { id: "2-4", title: "员工管理", path: '/system/staffAdmin' },
        ] },
        { id: "3", title: "菜单3", path: '' },
        { id: "4", title: "菜单4", path: '', child: [{ id: "3-1", title: "菜单4的子菜单", path: '' }] },
        { id: "5", title: "菜单5", path: '', child: [{ id: "4-1", title: "菜单5的子菜单", path: '' }] },
        { id: "6", title: "菜杀杀杀杀杀杀杀杀杀单6", path: '' },
        { id: "7", title: "菜单6", path: '' },
        { id: "8", title: "菜单888", path: '' },
      ],
    }
  },
  computed: {
    ...mapState('asidMenu',['isCollapse']),
  },
  mounted() {
    console.log()
  },
  methods: {
    
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
</style>
