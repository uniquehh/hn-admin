<template>
  <div class="hn-topnav-menus">
    <div class="hn-topnav-scroll">
      <el-menu :default-active="current" class="el-menu-demo" mode="horizontal" 
        @select="handleTopMenu"
        router  
      >
        <el-menu-item class="hn-hmenu-item" v-for="(item,index) in topMenus" :key="item.path" 
          :index="item.path" @click="handleMianBao(item.path)">
          <span style="margin-right: 5px;">{{ item.name }}</span>
          <i @click.stop="closeTopMenu(index)" v-show="item.path!='/index'" style="font-size: 14px;" class="el-icon-close"></i>
        </el-menu-item>
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
  computed:{
    ...mapState('topMenu',['topMenus','current']),
    ...mapState('asideMenu',['asideMenus']),
  },
  methods: {
    ...mapMutations('topMenu',['stSetTopMenus','stSetTopCurrent']),
    ...mapMutations('mianBaoXie',['stSetMianBaos']),
    // topmenu点击跳转路由并存储当前激活的路由
    handleTopMenu(path) {
      this.stSetTopCurrent(path)
    },
    // 关闭顶部激活的历史菜单
    closeTopMenu(ind) {
      // 若关闭的菜单是当前激活的菜单，则跳转他的前面一个菜单，并更新当前激活的菜单
      if (this.topMenus[ind].path == this.current && (ind == this.topMenus.length - 1)) {
        this.$router.push({ path: this.topMenus[ind - 1].path })
        this.stSetTopCurrent(this.topMenus[ind - 1].path)
        this.handleMianBao(this.current)
      } else if (this.topMenus[ind].path == this.current && (ind != this.topMenus.length - 1)) {
        this.$router.push({ path: this.topMenus[ind + 1].path })
        this.stSetTopCurrent(this.topMenus[ind + 1].path)
        this.handleMianBao(this.current)
      }
      // 若关闭的菜单不是当前激活的菜单，则正常更新菜单数据即可
      this.topMenus.splice(ind,1)
      this.stSetTopMenus(this.topMenus)
    },
  }
}
</script>

<style lang="scss" scoped>
.hn-topnav-menus{
  background-color: white;
  min-width: 800px;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
}
.hn-topnav-scroll{
  max-width: 1000px;
  overflow-x: auto;
}
.hn-hmenu-item{
  height: 36px !important;
  line-height: 36px !important;
  &:hover{
    background-color: #409EFF !important;
  }
}
.hn-hmenu-item [class^=el-icon-]{
  margin-right: 0;
  width: unset;
}
</style>