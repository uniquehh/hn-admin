<template>
  <div class="hn-topnav-menus">
    <el-menu :default-active="current" class="el-menu-demo" mode="horizontal" 
      @select="handleSelect"
      router  
    >
      <el-menu-item class="hn-hmenu-item" v-for="(item,index) in menus" :key="item.path" 
        :index="item.path" @click="handleMianBao(index)">
        <span style="margin-right: 5px;">{{ item.name }}</span>
        <i @click.stop="closeTopMenu(index)" v-show="item.path!='/index'" style="font-size: 14px;" class="el-icon-close"></i>
      </el-menu-item>
    </el-menu>
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
    ...mapState('topMenu',['menus','current']),
    ...mapState('asidMenu',['asideMenus']),
  },
  methods: {
    ...mapMutations('topMenu',['stSetTopMenus','stSetTopCurrent']),
    ...mapMutations('mianBaoXie',['stSetMianBaos']),
    // topmenu点击跳转路由并存储当前激活的路由
    handleSelect(path) {
      this.stSetTopCurrent(path)
    },
    // 关闭顶部激活的历史菜单
    closeTopMenu(ind){
      // 若关闭的菜单是当前激活的菜单，则跳转他的前面一个菜单，并更新当前激活的菜单
      if(this.menus[ind].path == this.current){
        this.$router.push({path:this.menus[ind-1].path})
        this.stSetTopCurrent(this.menus[ind-1].path)
        this.handleMianBao(ind-1)
      }
      // 若关闭的菜单不是当前激活的菜单，则正常更新菜单数据即可
      this.menus.splice(ind,1)
      this.stSetTopMenus(this.menus)
    },
    handleMianBao(ind){
      // 处理面包屑数据
      let mbtemp = []
      this.asideMenus.forEach(item=>{
        if(item.child.length){
          item.child.forEach(items=>{
            if(this.menus[ind].id==items.id){
              mbtemp.push(item)
              mbtemp.push(items)
            }
          })
        }else{
          if(this.menus[ind].id==item.id){
            mbtemp.push(item)
          }
        }
      })
      this.stSetMianBaos(mbtemp)
    },

  }
}
</script>

<style lang="scss" scoped>
.hn-topnav-menus{
  background-color: white;
  width: 1780px;
  overflow-x: auto;
}
.el-menu--horizontal{
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
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