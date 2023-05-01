<template>
  <div class="hn-power-main">
    <div class="hn-power-left">
      <div class="hn-powerl-head">
        <div class="hn-powerlh-item">
          <div class="hn-powerlhi-text">角色权限</div>
          <i @click="openARDialog" class="hn-powerlhi-icon el-icon-circle-plus-outline"></i>
        </div>
      </div>
      <div class="hn-powerl-cont">
        <div class="hn-powerlc-item" 
          :class="item.id == checkedRoleId ? 'curr-bg1' : ''"
          v-for="(item,index) in roles" 
          :key="item.id" 
          @click="getRoleMenuIds(item.id)">
          <div>{{ item.roleAlias }}</div>
          <div class="hn-powerlci-icons">
            <i @click.stop="openERDialog(index)" v-show="item.roleLevel != 0" class="hn-powerlhi-icon el-icon-edit"></i>
            <i @click.stop="deleteRole(item.id)" v-show="item.roleLevel!=0" class="hn-powerlci-icon el-icon-remove-outline"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="hn-power-right">
      <div class="hn-powerr-head">
        <div class="hn-powerrh-text">权限列表</div>
        <el-button type="primary" @click="setRolePower">保存</el-button>
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
    <!-- 添加角色的弹窗 -->
    <el-dialog :title="addOrEdit" width="400px" :visible.sync="showARDialog">
      <el-form :model="addRoleForm"  :rules="addRoleFormRules" ref="addRoleForm">
        <el-form-item label="角色名称" prop="roleAlias" required>
          <el-input v-model="addRoleForm.roleAlias" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色等级" prop="roleLevel" required>
          <el-select v-model="addRoleForm.roleLevel" placeholder="请选择角色等级">
            <el-option v-for="(item) in roleLevels" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showARDialog = false">取 消</el-button>
        <el-button  type="primary" @click="aRoleDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>

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
      checkedRoleId: "",//当前选中的角色id
      showARDialog: false,//是否显示添加角色的弹窗
      addOrEdit: "",//新增或编辑角色的弹窗标题
      currRoleId:"",//当前操作的角色id
      addRoleForm: {
        roleAlias:"",
        roleLevel:"",
        roleName:"",
      },
      addRoleFormRules: {
        roleAlias: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        roleLevel: [
          { required: true, message: '请选择角色等级', trigger: 'blur' },
        ],
      },
      roleLevels: [
        // { value: 1, label: "部门负责人", roleName :"ROLE_DEP"},
        { value: 2, label: "小组负责人", roleName: "ROLE_GROUP" },
        { value: 3, label: "普通员工", roleName: "ROLE_EMPLOYEE" },
        { value: 4, label: "医院用户", roleName: "ROLE_HOSPITAL" },
      ]
    }
  },
  mounted() {
    
  },
  created() {
    this.asyncTryCatch()
  },
  methods: {
    // 编辑角色
    editRole() {
      this.addRoleForm.roleName = this.roleLevels.find(item=>item.value==this.addRoleForm.roleLevel).roleName
      this.request("/authority/updateRole", {
        ...this.addRoleForm,
        id:this.currRoleId,
      }, 'put').then((res) => {
        if (res.code == 0) {
          this.showARDialog = false
          this.getRolesAll().then((ress) => {
            this.roles = ress.data
          })
          this.hnMsg()
        }
      })
    },
    // 添加角色
    addRole() {
      this.addRoleForm.roleName = this.roleLevels.find(item=>item.value==this.addRoleForm.roleLevel).roleName
      console.log(this.addRoleForm)
      this.request('/authority/addRole', this.addRoleForm, "post").then((res) => {
        if (res.code == 0) {
          this.showARDialog = false
          this.getRolesAll().then((ress) => {
            this.roles = ress.data
          })
          this.hnMsg()
        }
      })
    },
    // 重置角色弹窗表单数据
    resetRoleForm() {
      this.addRoleForm.roleAlias = ""
      this.addRoleForm.roleLevel = ""
      this.addRoleForm.roleName = ""
    },
    // 打开编辑角色弹窗
    openERDialog(ind) {
      this.showARDialog = true
      this.addOrEdit = "编辑角色"
      this.addRoleForm.roleAlias = this.roles[ind].roleAlias
      this.addRoleForm.roleLevel = this.roles[ind].roleLevel
      this.currRoleId = this.roles[ind].id
    },
    // 打开添加角色弹窗
    openARDialog() {
      this.resetRoleForm()
      this.showARDialog = true
      this.addOrEdit = "添加角色"
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.addRoleForm.clearValidate()
      })
    },
    // 添加/编辑角色弹窗确定
    aRoleDialogConfirm() {
      this.$refs.addRoleForm.validate((valid) => {
        if (valid) {
          this.addOrEdit=='添加角色'?this.addRole():this.editRole()
        } else {
          return false;
        }
      })
    },
    // 删除角色
    deleteRole(id) {
      this.hnMsgBox().then(() => {
        console.log(id)
        this.request('/authority/deleteRole', {
          roleId: id,
        }, 'delete').then((res) => {
          if (res.code == 0) {
            this.getRolesAll().then((ress) => {
              this.roles = ress.data
              if (this.checkedRoleId == id) {
                this.checkedRoleId = this.roles[0].id
                this.getRoleMenuIds(this.checkedRoleId)
              }
              this.hnMsg()
            })
            
            
          }
        })
      })
    },
    // 设置角色权限
    setRolePower() {
      this.request('/authority/setRolePermission', {
        menuIds:this.checkedMenuIds.join(','),
        roleId:this.checkedRoleId,
      }, 'put','form').then((res) => {
        if (res.code == 0) {
          this.getRoleMenuIds(this.checkedRoleId)
          this.hnMsg()
        }
      })
    },
    // 统一处理数据的容器
    async asyncTryCatch() {
      try {
        let res1 = await this.getRolesAll()
        this.roles = res1.code == 0 ? res1.data : []
        this.checkedRoleId = res1.code == 0 ? res1.data[0].id : ""
        let res2 = await this.getMenusAll()
        this.menusAll = res2.code == 0 ? res2.data : []
        this.handleMenus()
        this.checkedRoleId ? this.getRoleMenuIds(this.checkedRoleId) :''
      } catch (error) {
        console.log(error,"trycatch")
        this.checkedMenuIds = []
        this.roles = []
        this.menusAll = []
      }
    },
    // 回显当前角色拥有的菜单权限
    checkHasPower() {
      console.log(this.checkedMenuIds,7)
      this.menus.forEach((item) => {
        if (this.checkedMenuIds.find(ids => ids == item.id)) {
          item.checked = true
        } else {
          item.checked = false
        }
      })

      this.menus.forEach((item) => {
        item.child.forEach((items) => {
          if (this.checkedMenuIds.find(ids => ids == items.id)) {
            item.checked = true //有子菜单权限，则父级菜单自动有权限
            items.checked = true
          } else {
            items.checked = false
          }
        })
      })
      console.log(this.menus)
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
      allchecked.forEach(item => this.checkedMenuIds.push(Number(item.id)))
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
.el-dialog__body{
  display: flex;
  justify-content: center;
  .el-input{
    width: 100% !important;
  }
  .el-select{
    width: 100% !important;
  }
}
</style>