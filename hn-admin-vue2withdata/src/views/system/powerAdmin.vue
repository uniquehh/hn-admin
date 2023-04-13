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
        <div class="hn-powerlc-item" 
          :class="item.id == checkedRoleId ? 'curr-bg1' : ''"
          v-for="(item) in roles" 
          :key="item.id" 
          @click="getRoleMenuIds(item.id)">
          <div>{{ item.roleAlias }}</div>
          <i class="hn-powerlci-icon el-icon-remove-outline"></i>
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
              <span class="hn-check-tect">{{ item.menuAlias }}</span>
            </div>
          </div>
          <div class="hn-powerrci-child" v-for="(items,indexs) in item.child" :key="items.id">
            <div class="hn-mycheck-box" @click="ccheckClick(items.checked,index,indexs)">
              <input :checked="items.checked" class="hn-check-inp" type="checkbox">
              <span class="hn-check-tect">{{ items.menuAlias }}</span>
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
      checkedMenuIds: [],//选中的菜单id集合
      roles:[],//所有角色
      menusAll: [],//所有菜单
      menus: [],//根据所有菜单处理好父子级关系的菜单
      checkedRoleId:"",//当前选中的角色id
    }
  },
  mounted() {
    
  },
  created() {
    this.getRolesAll().then(res => {
      if (res.code == 0) {
        this.checkedRoleId = res.data[0].id
        this.roles = res.data
        this.getRoleMenuIds(res.data[0].id)
      }
    })
    this.getMenusAll().then(res => {
      if (res.code == 0) {
        this.menusAll = res.data
        this.handleMenus()
      }
    })
    
  },
  methods: {
    // 回显当前角色拥有的菜单权限
    checkHasPower() {
      for (let i = 0; i < this.checkedMenuIds.length; i++){
        for (let j = 0; j < this.menus.length; j++) {
          if (this.checkedMenuIds[i] == this.menus[j].id) {
            this.menus[j].checked = true
            for (let k = 0; k < this.menus[j].child.length; k++) {
              if (this.checkedMenuIds[i] == this.menus[j].child[k].id) {
                this.menus[j].child[k].checked = true
              }
            }
          }
        }
      }


      // console.log(this.checkedMenuIds,7)
      // this.menus.forEach((item) => {
      //   this.checkedMenuIds.forEach((items) => {
      //     if (item.id == items) {
      //       item.checked = true
      //       item.child.forEach((itemss) => {
      //         if (itemss.id == items) {
      //           itemss.checked = true
      //         }
      //       })
      //     }
      //   })
      // })
      // console.log(this.menus)
    },
    // 获取角色菜单id集合
    getRoleMenuIds(id) {
      this.checkedRoleId = id
      this.request('/authority/getRoleMenuIdList', {
        roleId:id
      }).then((res) => {
        if (res.code == 0) {
          this.checkedMenuIds = res.data
          this.checkHasPower()
        }
      })
    },
    // 删除角色
    deleteRole() {
      this.request('/authority/deleteRole', {}, "delete")
    },
    // 新增角色
    addRole() {
      this.request('/authority/addRole', {}, "post")
    },
    // 根据一级菜单选中状态改变子菜单选中状态
    pcheckClick(check,ind){
      this.menus[ind].checked = !check
      this.menus[ind].child.forEach(items=>items.checked = !check)
      this.getcheckedMenuIds()
    },
    // 根据子菜单选中状态改变父级菜单选中状态
    ccheckClick(check,ind,inds){
      this.menus[ind].child[inds].checked = !check
      this.menus[ind].checked = true
      this.getcheckedMenuIds()
    },
    getcheckedMenuIds(){
      // 选中的父级菜单
      let pcheckeds = this.menus.filter(item=>item.checked==true)
      // 选中的子级菜单
      let ccheckeds = []
      pcheckeds.forEach(item=>{
        ccheckeds.push(...item.child.filter(items=>items.checked==true))
      })
      // 合并选中的菜单数据
      let allchecked = [...pcheckeds,...ccheckeds]
      // 将选中的菜单的id数据存储在checkedMenuIds中
      this.checkedMenuIds = []
      allchecked.forEach(item => this.checkedMenuIds.push(item.id))
      console.log(this.checkedMenuIds)
    },
    // 处理菜单数据
    handleMenus(){
      let pmenu = this.menusAll.filter(item=>item.menuLevel==0)
      pmenu.forEach(item => {
        this.$set(item,'checked',false)
        item.child = []
        this.menusAll.forEach(items=>{
          this.$set(items,'checked',false)
          if(items.menuGroup == item.menuGroup&&items.menuLevel!=0){
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