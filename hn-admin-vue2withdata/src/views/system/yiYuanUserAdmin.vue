<template>
  <div class="hn-yiy-main">
    <div class="hn-power-left">
      <div class="hn-yiyml-head">
        <!-- <el-button  icon="el-icon-upload">导出全部</el-button> -->
        <el-button  icon="el-icon-plus" @click="opEditYYDialog('add')" type="primary">新增医院</el-button>
      </div>
      <div class="hn-yiyml-search">
        <div class="hn-yiymls-cas">
          <el-cascader
            ref="sYYArea"
            v-model="searchArea"
            :props="areaProps"
            :options="chinaArea"
            placeholder="行政区域"
            @change="searchAreaChange"
            clearable
          >
          </el-cascader>
        </div>
        <div class="hn-yiymls-inp">
          <el-input @change="getYYTableData" v-model="yyList._params.name" prefix-icon="el-icon-search" clearable placeholder="请输入医院名称"></el-input>
        </div>
      </div>
      <div class="hn-yiyml-table">
        <el-table @row-click="clickRow" :row-class-name="tableRowClassName" :data="yyList._list" style="width: 100%">
          <el-table-column prop="name" label="医院名称">
          </el-table-column>
          <el-table-column label="行政区域">
            <template slot-scope="scope">
              <span>{{ scope.row.province +' ' + scope.row.city }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button style="color: red;" type="text" @click.stop="deleteYY(scope.row)">删除</el-button>
              <el-button type="text" @click.stop="opEditYYDialog('edit',scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="yyList._total > 0" 
          :total="yyList._total" 
          :page="yyList._page" 
          :limit="yyList._limit"
          layout='total, prev, pager, next, sizes, jumper'
          @pagination="yyPagingChange" 
        />
      </div>
    </div>
    <div class="hn-power-right" v-show="yyList._list.length">
      <div class="hn-yiymr-head">
        <div class="hn-yiymrh-text" v-if="yyList._list[currYYIndex]">{{ yyList._list[currYYIndex].name }}</div>
        <div class="hn-yiymrh-shbox"> 
          <el-button icon="el-icon-plus" type="primary" @click="opUserDialog('add')">新增用户</el-button>
        </div>
      </div>
      <div class="hn-yiymr-table">
        <el-table :data="yyUList._list" style="width: 100%">
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
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button style="color: red;" type="text" @click="deleteUser(scope.row.id)">删除</el-button>
              <el-button type="text" @click="opUserDialog('edit',scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="yyUList._total > 0" 
          :total="yyUList._total" 
          :page="yyUList._page" 
          :limit="yyUList._limit"
          layout='total, prev, pager, next, sizes, jumper'
          @pagination="userPagingChange" 
        />
      </div>
    </div>
    <!-- 新增、编辑医院弹窗 -->
    <el-dialog :title="eYYDialogTitle" width="600px" :visible.sync="showEYYDialog">
      <el-form :model="eYYForm"  :rules="eYYFormRules" ref="eYYForm">

        <div class="hn-fitem-box">
          <el-form-item label="医院名称" required prop="name">
            <el-input v-model="eYYForm.name" placeholder="请输入医院名称" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="医院类型">
            <el-input v-model="eYYForm.type" placeholder="请输入医院类型" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="行政区域" required prop="cityCode">
            <el-cascader
              v-model="eYYForm.cityCode"
              :props="eYYFormProps"
              :options="chinaArea2"
              placeholder="请选择行政区域"
              @change="editAreaChange"
              @expand-change="getAreaByParent"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="order" label="医院排序">
            <el-input-number class="hn-yygl-numinp" v-model="eYYForm.order" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
        </div>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEYYDialog = false">取 消</el-button>
        <el-button type="primary" @click="eYYFormConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加/编辑用户的弹窗 -->
    <el-dialog :title="editDilogTitle" width="600px" :visible.sync="showEUDialog">
      <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserForm">
        <div class="hn-fitem-box">
          <el-form-item label="登录账号" prop="realName" required>
            <el-input v-model="editUserForm.realName" placeholder="请输入真实姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="登录密码" prop="password" required>
            <el-input placeholder="请输入密码" v-model="editUserForm.password" show-password type="password" />
          </el-form-item>
        </div>
        
        <!-- <div class="hn-fitem-box">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="editUserForm.age" type="number" placeholder="请输入年龄" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="editUserForm.sex" placeholder="请选择性别">
              <el-option v-for="(sex) in sexOption" :key="sex.value" :label="sex.label" :value="sex.value"></el-option>
            </el-select>
          </el-form-item>
        </div> -->
        
        <div class="hn-fitem-box">
          <el-form-item label="所属角色" prop="roleId" required>
            <el-select v-model="editUserForm.roleId" placeholder="请选择所属角色">
              <el-option v-for="(item) in roles" :key="item.id" :label="item.roleAlias" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEUDialog = false">取 消</el-button>
        <el-button type="primary" @click="eUserFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      searchArea:"",
      areaProps:{
        value:'cityCode',
        label:'name',
        children:'child',
        lazy: true,
        lazyLoad:this.lazyLoad
      },
      eYYFormProps:{
        value:'cityCode',
        label:'name',
        children:'child'
      },
      chinaArea: [],//有懒加载的区域级联选择
      chinaArea2:[],//无懒加载的区域级联选择--用于弹窗，方便回显
      yyList:new Paging("/hospital/getHospitalPage",{name:'',order:"id DESC"},'post'),
      yyUList:new Paging("/hospital/getUserByHospital",{hospitalId:'',order:"id DESC"},'post'),

      currUserId:"",//当前操作的用户id
      currYYId:"",//当前操作的医院id

      showEYYDialog:false,//新增、编辑医院弹窗显隐
      eYYDialogTitle:"",//医院弹窗标题
      eYYForm:{
        "city": "",
        "cityCode": "",
        "name": "",
        "province": "",
        "type":"",
        "order":1
      },
      eYYFormRules: {
        name: [
          { required: true, message: '请输入医院名称', trigger: 'blur' },
        ],
        cityCode: [
          { required: true, message: '请选择行政区域', trigger: 'blur' },
        ],
        order: [
          { required: true, message: '请输入医院排序', trigger: 'blur' },
        ],
      },

      editUserForm:{ //新增修改用户的表单
        "password": "",
        "realName": "",
        "roleId": "",
      },
      editUserFormRules: {
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择所属角色', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
        ],
      },
      sexOption:[
        {value:0,label:'女'},
        {value:1,label:'男'},
        {value:2,label:'保密'}
      ],
      roles:[],//所有医院角色
      editDilogTitle:"",
      showEUDialog: false,
      
      setClassId:"",//点击行的时候记录的医院id--与操作栏点击的currYYId分开，便于加行class
    }
  },
  computed:{
    currUserIndex(){ //当前操作的用户所在list的下标
      return this.yyUList._list.findIndex(item=>item.id==this.currUserId)
    },
    currYYIndex(){ //当前操作医院id--与右侧医院用户列表同步
      return this.yyList._list.findIndex(item=>item.id==this.setClassId)
    },
  },
  created(){
    this.getHostRoles()
    this.getAreaData()
    // this.getYYTableData()
    // 进入页面加载医院表格数据，默认展示第一条医院的用户
    this.yyList.exec().then((res)=>{
      if(res&&res.length){
        this.currYYId = this.yyList._list[0].id
        this.setClassId = this.yyList._list[0].id
        this.getUserListByYY()
        // console.log(this.yyList)
      }
    })
  },
  methods: {
    // 获取新增医院用户时选中角色得角色数据
    getHostRoles(){
      this.request("/hospital/getHospitalRoleList").then((res)=>{
        if(res.code==0){
          this.roles = res.data
        }
      })
    },
    // 给当前点击得行设置类名-实现高亮
    tableRowClassName({row, rowIndex}) {
      if (row.id === this.setClassId) {
        return 'rowbg';
      } else {
        return '';
      }
    },
    // 行点击事件
    clickRow(row){
      this.setClassId = row.id
      this.currYYId = row.id
      this.getUserListByYY()
    },
    // 删除医院用户
    deleteUser(id){
      this.hnMsgBox().then(()=>{
        this.request("/hospital/deleteHospitalUser",{
          userIdList:id
        },"delete",'form').then((res)=>{
          if(res.code==0){
            this.getUserListByYY()
            this.hnMsg()
          }
        })
      })
    },
    // 重置弹窗表单
    resetUserForm(){
      this.editUserForm = {
        "password": "",
        "realName": "",
        "roleId": "",
      }
    },
    // 新增用户
    addUser(){
      this.request("/hospital/saveHospitalUser",{
        ...this.editUserForm,
        hospitalId:this.currYYId,
      },"post").then((res)=>{
        if(res.code==0){
          this.getUserListByYY()
          this.hnMsg()
        }
      })
    },
    // 修改用户
    editUser(){
      this.request("/hospital/updateHospitalUser",{
        ...this.editUserForm,
        id:this.currUserId,
        hospitalId:this.currYYId,
      },"put").then((res)=>{
        if(res.code==0){
          this.getUserListByYY()
          this.hnMsg()
        }
      })
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
    // 打开用户新增、修改弹窗
    opUserDialog(type,row){
      // console.log(this.currYYId,'--------')
      this.showEUDialog = true
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.editUserForm.clearValidate()
      })
      if(type=='edit'){ //修改
        this.currUserId = row.id
        this.editDilogTitle = "修改用户"
        // console.log(row)
        let nroleId = row.roleVo?row.roleVo.id:''
        this.editUserForm = JSON.parse(JSON.stringify(row))
        this.editUserForm.roleId = nroleId
      }else{ // 新增
        this.editDilogTitle = "新增用户"
        this.resetUserForm()
      }

    },
    // 重置医院弹窗表单数据
    resetEYYForm(){
      this.eYYForm = {
        "city": "",
        "cityCode": "",
        "name": "",
        "province": "",
        "type":"",
        "order":1
      }
    },
    // 新增医院
    addYY(){
      this.request("/hospital/saveHospital",{
        "cityCode": this.eYYForm.cityCode[1],
        "name": this.eYYForm.name,
        "province": this.eYYForm.province,
        "city": this.eYYForm.city,
        "type": this.eYYForm.type,
        "order": this.eYYForm.order,
      },'post').then((res)=>{
        if(res.code==0){
          this.getYYTableData()
          this.hnMsg()
        }
      })
    },
    // 初始化所有表格相关数据
    resetAllTable(){
      this.yyList._list = []
      this.yyUList._list = []
      this.yyList._total = 0
      this.yyUList._total = 0
      this.resetUserPaging()
      this.resetYYPaging()
    },
    // 删除医院
    deleteYY(row){
      this.hnMsgBox().then(()=>{
        this.request("/hospital/deleteHospital",{
          hospitalIdList:row.id
        },'delete','form').then((res)=>{
          if(res.code==0){
            this.getYYTableData().then((ress)=>{
              if(this.currYYId==row.id&&!this.isEmpty(ress)){ 
                this.currYYId = ress[0].id
                this.getUserListByYY()
              }else if(this.currYYI==row.id&&this.isEmpty(ress)){
                // 若删除得是当前选中得医院，且医院数据为空，则医院和用户数据置空
                this.resetAllTable()
              }
              this.hnMsg()
            })
          }
        })
      })
    },
    // 修改医院
    updateYY(){
      this.request("/hospital/updateHospital",{
        "cityCode": this.eYYForm.cityCode[1],
        "name": this.eYYForm.name,
        "id": this.currYYId,
        "province": this.eYYForm.province,
        "city": this.eYYForm.city,
        "type": this.eYYForm.type,
        "order": this.eYYForm.order,
      },'put').then((res)=>{
        if(res.code==0){
          this.getYYTableData()
          this.hnMsg()
        }
      })
    },
    // 打开添加、修改医院弹窗
    opEditYYDialog(type,row){
      // console.log(type,row)
      this.showEYYDialog = true
      this.$nextTick(() => { //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
        this.$refs.eYYForm.clearValidate()
      })
      if(type=='edit'){
        this.currYYId = row.id
        this.eYYDialogTitle = "编辑医院"
        this.$nextTick(async ()=>{
          // 获取省code 和城市code用于区域下拉回显
          let temp = [row.cityCode.slice(0,2),row.cityCode]
          // console.log(temp,this.chinaArea2)
          let pind = this.chinaArea2.findIndex(item=>item.cityCode==temp[0])
          let res = await this.getChinaAreaList({
            level:'1',
            cityCode:temp[0]
          })
          this.chinaArea2[pind].child = res

          this.eYYForm.province = row.province
          this.eYYForm.city = row.city

          this.eYYForm = JSON.parse(JSON.stringify(row))
          this.eYYForm.cityCode = temp
        })
      }else{
        this.resetEYYForm()
        this.eYYDialogTitle = '新增医院'
      }

    },
    // 编辑、新增医院弹窗确认
    eYYFormConfirm(){
      this.$refs.eYYForm.validate((valid)=>{
        if(valid){
          this.eYYDialogTitle=='编辑医院'?this.updateYY():this.addYY()
          this.showEYYDialog = false
        }else{
          return false
        }
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
            this.yyUList._list[this.currUserIndex].userBlock = !row.userBlock
            this.hnMsg()
          }
        })
      })
    },
    // 动态加载行政区域数据
    async lazyLoad (node, resolve) {
      if(node.level==0)return;
      this.tempNode = node
      this.tempResolve = resolve
      let res = await this.getChinaAreaList({
        level:'1',
        cityCode:node.data.cityCode
      })
      res.forEach(item=>{
        item.leaf = node.level>=1 //只显示0，1两层
      })
      resolve(res)
    },
    async getAreaData(){
      // 若本地缓存没有全国区域数据，则请求接口获取
      let chinaArea = JSON.parse(window.localStorage.getItem('chinaArea'))
      if (this.isEmpty(chinaArea)) {
        this.chinaArea = await this.getChinaAreaList()
        this.chinaArea2 = JSON.parse(JSON.stringify(this.chinaArea))
      }else{
        this.chinaArea = JSON.parse(JSON.stringify(chinaArea))
        this.chinaArea2 = JSON.parse(JSON.stringify(chinaArea))
      }
    },
    // 行政区域选择--筛选
    searchAreaChange(value) {
      this.yyList._params.cityCode = value.length?value[1]:''
      this.getYYTableData()
    },
    // 行政区域选择--添加
    editAreaChange(value) {
      // console.log(value)
      let pindex = this.chinaArea2.findIndex(item=>item.cityCode==value[0])
      this.eYYForm.province = this.chinaArea2[pindex].name
      this.eYYForm.city = this.chinaArea2[pindex].child.find(item=>item.cityCode==value[1]).name
      // console.log(this.eYYForm)
    },
    async getAreaByParent(val){
      // console.log(val,756)
      let pind = this.chinaArea2.findIndex(item=>item.cityCode==val[0])
      let res = await this.getChinaAreaList({
        level:'1',
        cityCode:val[0]
      })
      this.chinaArea2[pind].child = res
    },
    // 获取医院表格数据
    async getYYTableData(){
      let res = await this.yyList.exec()
      // console.log(res,999)
      return JSON.parse(JSON.stringify(res))
    },
    // 根据医院获取医院下的用户数据
    getUserListByYY(row){
      if(row){
        this.currYYId = row.id
        this.resetUserPaging()
      }
      this.yyUList._params.hospitalId = this.currYYId
      this.yyUList.exec()
    },
    // 重置医院表格页码
    resetYYPaging(){
      this.yyList._page = 1
      this.yyList._limit = 20
    },
    // 重置医院表格页码
    resetUserPaging(){
      this.yyUList._page = 1
      this.yyUList._limit = 20
    },
    yyPagingChange(e){
      this.yyList._page = e.page
      this.yyList._limit = e.limit
      this.getYYTableData()
    },
    userPagingChange(e){
      this.yyUList._page = e.page
      this.yyUList._limit = e.limit
      this.getUserListByYY()
    },
  }
}
</script>

<style scoped lang="scss">

</style>