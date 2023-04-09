<template>
  <div class="hn-power-main">
    <div class="hn-power-left">
      <div class="hn-powerl-head">
        <div class="hn-powerlh-item">
          <div class="hn-powerlhi-text">所属角色</div>
          <i class="hn-powerlhi-icon el-icon-circle-plus-outline"></i>
        </div>
      </div>
      <div class="hn-powerl-cont">
        <div class="hn-powerlc-item">
          超级管理员
        </div>
      </div>
    </div>
    <div class="hn-power-right">
      <div class="hn-powerr-head">
        <div class="hn-powerrh-text">权限列表</div>
        <div class="hn-powerrh-bcbtn">
          <el-button type="primary" size="medium">保存</el-button>
        </div>
      </div>
      <div class="hn-powerr-cont">
        <div class="hn-powerrc-item" v-for="(item,index) in menus" :key="item.id">
          <div class="hn-powerrci-parent">
            <div class="hn-mycheck-box" @click="pcheckClick(item.checked,index)">
              <input :checked="item.checked" class="hn-check-inp" type="checkbox">
              <span class="hn-check-tect">{{ item.name }}</span>
            </div>
          </div>
          <div class="hn-powerrci-child" v-for="(items,indexs) in item.child" :key="items.id">
            <div class="hn-mycheck-box" @click="ccheckClick(items.checked,index,indexs)">
              <input :checked="items.checked" class="hn-check-inp" type="checkbox">
              <span class="hn-check-tect">{{ items.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedMenus: [],
      cities: [
        {id:1,name:"一级菜单1",pid:0},
        {id:2,name:"一级菜单2",pid:0},
        {id:101,name:"一级菜单1的子权限1",pid:1},
        {id:102,name:"一级菜单1的子权限2",pid:1},
        {id:201,name:"一级菜单2的子权限1",pid:2}
      ],
      menus:[],
    }
  },
  mounted() {
    
  },
  created() {
    this.handleMenus()
  },
  methods: {
    // 根据一级菜单选中状态改变子菜单选中状态
    pcheckClick(check,ind){
      this.menus[ind].checked = !check
      this.menus[ind].child.forEach(items=>items.checked = !check)
      this.getCheckedMenus()
    },
    // 根据子菜单选中状态改变父级菜单选中状态
    ccheckClick(check,ind,inds){
      this.menus[ind].child[inds].checked = !check
      this.menus[ind].checked = true
      this.getCheckedMenus()
    },
    getCheckedMenus(){
      // 选中的父级菜单
      let pcheckeds = this.menus.filter(item=>item.checked==true)
      // 选中的子级菜单
      let ccheckeds = []
      pcheckeds.forEach(item=>{
        ccheckeds.push(...item.child.filter(items=>items.checked==true))
      })
      // 合并选中的菜单数据
      let allchecked = [...pcheckeds,...ccheckeds]
      // 将选中的菜单的id数据存储在checkedMenus中
      this.checkedMenus = []
      allchecked.forEach(item=>this.checkedMenus.push(item.id))
    },
    // 处理菜单数据
    handleMenus(){
      let pmenu = this.cities.filter(item=>item.pid==0)
      pmenu.forEach(item => {
        this.$set(item,'checked',false)
        item.child = []
        this.cities.forEach(items=>{
          this.$set(items,'checked',false)
          if(items.pid==item.id){
            item.child.push(items)
          }
        })
      });
      this.menus = pmenu
    },
  }
}
</script>

<style scoped lang="scss">

</style>