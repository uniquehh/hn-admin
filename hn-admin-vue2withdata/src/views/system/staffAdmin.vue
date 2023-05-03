<template>
  <div class="hn-staff-main">
    <div class="hn-power-right">
      <div class="hn-yiymr-head">
        <!-- <div class="hn-yiymrh-text">xxx公司</div> -->
        <div class="hn-yiymrh-shbox">
          <el-input prefix-icon="el-icon-search" @keyup.enter.native="inputSearch" v-model="list._params.searchValue" placeholder="姓名，账号，联系方式" class="hn-yiymrh-search"></el-input>
          <el-button @click="resetSearch">重置</el-button>
          <el-button icon="el-icon-search" @click="inputSearch" type="primary">搜索</el-button>
        </div>
        <div class="hn-yiymrh-shbox">
          <el-button icon="el-icon-delete" type="danger" @click="deleteUser(null)">批量删除</el-button>
          <el-button icon="el-icon-plus" type="primary" @click="opUserDialog('add')">新增用户</el-button>
        </div>
      </div>
      <div class="hn-yiymr-table">
        <el-table :data="list._list" style="width: 100%"
        @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="loginName" label="账号">
          </el-table-column>
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名">
          </el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <span>{{ scope.row.sex==0?'女':scope.row.sex==1?'男':'保密' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色权限">
            <template slot-scope="scope">
              <span v-if="scope.row.roleVo">{{ scope.row.roleVo.roleAlias }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="groupName" label="所属小组">
          </el-table-column>
          <el-table-column label="禁止登录">
            <template slot-scope="scope">
              <el-switch :value="scope.row.userBlock" @change="handLoginStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="禁止接单">
            <template slot-scope="scope">
              <el-switch :value="scope.row.whetherReceive"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteUser(scope.row.id)" style="color: red;">删除</el-button>
              <el-button type="text" @click="opUserDialog('edit',scope.row)">修改</el-button>
              <el-button type="text" @click="resetUserPass(scope.row)">重置密码</el-button>
              <!-- <el-button type="text">关联公司</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="list._total > 0" 
          :total="list._total" 
          :page="list._page" 
          :limit="list._limit"
          layout='total, prev, pager, next, sizes, jumper'
          @pagination="pagingChange" 
        />
      </div>
    </div>
    <!-- 添加/编辑用户的弹窗 -->
    <el-dialog :title="editDilogTitle" width="600px" :visible.sync="showEUDialog">
      <el-form :model="editUserForm"  :rules="editUserFormRules" ref="editUserForm">
        <div class="hn-fitem-box">
          <el-form-item label="真实姓名" prop="realName" required>
            <el-input v-model="editUserForm.realName" placeholder="请输入真实姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" prop="loginName" required>
            <el-input v-model="editUserForm.loginName" placeholder="请输入登录账号" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="editUserForm.age" type="number" placeholder="请输入年龄" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="editUserForm.sex" placeholder="请选择性别">
              <el-option v-for="(sex) in sexOption" :key="sex.value" :label="sex.label" :value="sex.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="电话号码" prop="phone" required>
            <el-input v-model="editUserForm.phone" placeholder="请输入电话号码" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属角色" prop="roleId" required>
            <el-select v-model="editUserForm.roleId" placeholder="请选择所属角色">
              <el-option v-for="(role) in roles" :key="role.id" :label="role.roleAlias" :value="role.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="所属小组" prop="roleId" required>
            <el-select v-model="editUserForm.groupId" placeholder="请选择所属小组">
              <el-option v-for="(item) in groupData._list" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showEUDialog = false">取 消</el-button>
        <el-button  type="primary" @click="eUserFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      list: new Paging('/user/getUserPage', { searchValue: "",order:"id DESC" },'post'),
      editUserForm:{
        "age": "",
        "loginName": "",
        groupId:"",
        "phone": "",
        "realName": "",
        "roleId": "",
        "sex": 0
      },
      groupData: new Paging('/group/getGroupPage', { order:"id DESC" },'post'),
      editUserFormRules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        loginName: [
          { required: true, message: '请选择登录账号', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择所属角色', trigger: 'blur' },
        ],
        groupId: [
          { required: true, message: '请选择所属小组', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
      },
      editDilogTitle:"",
      showEUDialog:false,
      currUserId:"",//当前操作的用户id
      roles:[],//所有用户角色
      sexOption:[
        {value:0,label:'女'},
        {value:1,label:'男'},
        {value:2,label:'保密'}
      ],
      selectedRowIds:[],//选中的表格数据的id集合
    }
  },
  computed:{
    currUserIndex(){ //当前操作的用户所在list的下标
      return this.list._list.findIndex(item=>item.id==this.currUserId)
    },
  },
  created(){
    this.getGroupData()
    this.getUserListData()
    this.getUserRoles()
  },
  mounted() {

  },
  methods: {
    // 获取新增用户时得角色下拉数据
    getUserRoles(){
      this.request("/user/getUserRoleList").then((res)=>{
        if(res.code==0){
          this.roles = res.data
        }
      })
    },
    // 重置搜索
    resetSearch(){
      this.list._params.searchValue = ''
      this.getUserListData()
    },
    // 获取小组管理数据
    getGroupData() {
      this.groupData._limit = 200
      this.groupData.exec()
    },
    // 重置用户密码
    resetUserPass(row){
      this.currUserId = row.id
      this.hnMsgBox("您确定要执行此操作吗？").then(()=>{
        this.request("/user/resetPassword",{
          userId:row.id
        },'put','form').then((res)=>{
          if(res.code==0){
            this.hnMsg()
          }
        })
      })
    },
    // 是否禁止登录
    handLoginStatus(row){
      this.currUserId = row.id
      this.hnMsgBox("您确定要执行此操作吗？").then(()=>{
        this.request("/user/isBlockUser",{ //false-未禁止，true-禁止
          userBlock:!row.userBlock,
          userId:row.id
        },'put','form').then((res)=>{
          if(res.code==0){
            this.list._list[this.currUserIndex].userBlock = !row.userBlock
            this.hnMsg()
          }
        })
      })
    },
    // 传入了id则是单独删除一个，没传入则是批量删除
    deleteUser(id){
      if(!id&&this.selectedRowIds.length==0){
        this.hnMsg("请选择要删除的数据",'info')
        return
      }
      this.hnMsgBox().then(()=>{
        this.request("/user/deleteUser",{
          userIdList:id?id:this.selectedRowIds.join(',')
        },"delete",'form').then((res)=>{
          if(res.code==0){
            this.getUserListData()
            this.hnMsg()
          }
        })
      })
    },
    // 表格数据选中事件
    handleSelectionChange(rows) {
      this.selectedRowIds = []
      rows.forEach((item)=>{
        this.selectedRowIds.push(item.id)
      })
    },
    // 新增用户
    addUser(){
      this.request("/user/addUser",this.editUserForm,"post").then((res)=>{
        if(res.code==0){
          this.getUserListData()
          this.hnMsg()
        }
      })
    },
    // 修改用户
    editUser(){
      this.request("/user/updateUser",{
        ...this.editUserForm,
        id:this.currUserId
      },"put").then((res)=>{
        if(res.code==0){
          this.getUserListData()
          this.hnMsg()
        }
      })
    },
    // 重置弹窗表单
    resetUserForm(){
      this.editUserForm = {
        "age": "",
        "loginName": "",
        "phone": "",
        "realName": "",
        "roleId": "",
        "sex": 0
      }
    },
    // 打开弹窗
    opUserDialog(type,row){
      this.showEUDialog = true
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.editUserForm.clearValidate()
      })
      if(type=='edit'){ //修改
        this.currUserId = row.id
        this.editDilogTitle = "修改用户"
        let nroleId = row.roleVo?row.roleVo.id:''
        this.editUserForm = JSON.parse(JSON.stringify(row))
        this.editUserForm.roleId = nroleId
      }else{ // 新增
        this.editDilogTitle = "新增用户"
        this.resetUserForm()
      }

    },
    // 编辑用户弹窗确认
    eUserFormConfirm(){
      this.$refs.editUserForm.validate((valid) => {
        if (valid) {
          this.editDilogTitle == "新增用户"?this.addUser():this.editUser()
          this.showEUDialog = false
        } else {
          return false;
        }
      })
    },
    // 输入框搜索
    inputSearch(){
      this.resetPaging()
      this.getUserListData()
    },
    // 获取用户数据
    getUserListData(){
      this.list.exec()
    },
    // 重置页数
    resetPaging(){
      this.list._page = 1
      this.list._limit = 20
    },
    // 页数发生改变
    pagingChange(e){
      this.list._page = e.page
      this.list._limit = e.limit
    },
  }
}
</script>

<style scoped lang="scss">

</style>