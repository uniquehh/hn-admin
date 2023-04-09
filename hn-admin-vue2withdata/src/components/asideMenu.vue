<template>
  <div class="hn-aside-menu">
    <div class="hn-aside-title">
      <img src="../assets/logo.png" alt="">
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
        @select="selectMenu"
        @open="menuItemClick"
      >
        <template v-for="(item,index) in asideMenus">
          <!-- 有子菜单才渲染 -->
            <el-submenu :key="item.id + 'smenu'" :index="item.id" v-if="item.child.length">
              <template #title>
                <i class="el-icon-location"></i>
                <span :title="item.name">{{ item.name }}</span>
              </template>
              <el-menu-item v-for="(items,indexs) in item.child" :key="items.id" 
                :index="items.path"
                @click="menuItemClick(index,indexs)"
              >
                <i class="el-icon-location"></i>
                <span :title="items.name">{{ items.name }}</span>
              </el-menu-item>
            </el-submenu>
            <!-- 无子菜单才渲染 -->
            <el-menu-item :key="item.id + 'menu'" :index="item.path" @click="menuItemClick(index,null)" v-else>
              <i class="el-icon-location"></i>
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
    ...mapState('asidMenu',['isCollapse','asideMenus']),
    ...mapState('topMenu',['menus','current']),
  },
  mounted() {

  },
  methods: {
    // 用store管理topmenu
    ...mapMutations('topMenu',['stSetTopMenus','stSetTopCurrent']),
    // 面包屑
    ...mapMutations('mianBaoXie',['stSetMianBaos']),
    selectMenu(index){
      // 存储更新当前激活的path
      this.stSetTopCurrent(index)
      // 判断历史菜单记录中是否已经有了该菜单数据
      let temp = this.menus.find(item=>item.path==index)
      if(temp)return;
      // 对比path，找到新激活的菜单数据
      this.asideMenus.forEach(item=>{
        if(item.child.length){
          item.child.forEach(items=>{
            if(items.path==index){
              this.menus.push(items)
            }
          })
        }else{
          if(item.path==index){
            this.menus.push(item)
          }
        }
      })
      // 把处理好的数据用store存储在topmenu中
      this.stSetTopMenus(this.menus)
    },
    // 处理面包屑数据
    menuItemClick(pind,cind){
      let temp = []
      temp.push(this.asideMenus[pind])
      if(cind!=null)temp.push(this.asideMenus[pind].child[cind]);
      this.stSetMianBaos(temp)
    },


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
