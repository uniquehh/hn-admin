<template>
  <div class="hn-myctomer-main">
    <div class="hn-mctm-head">
      <div class="hn-mctmh-left">
        <el-button class="hn-mctmhl-btn" icon="el-icon-plus" type="primary" @click="showAddCusDialog=true">添加新客户</el-button>
      </div>
      <!-- <div class="hn-mctmh-right">
        <i class="hn-mctmhr-icon el-icon-refresh" @click="getCustData"></i>
        <i class="hn-mctmhr-icon el-icon-s-operation"></i>
      </div> -->
    </div>
    <div class="hn-mcust-shbox">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="tableData._params.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户手机号" prefix-icon="el-icon-search" v-model="tableData._params.phone"></el-input>
      <el-button @click="resetSearchForm">重置</el-button>
      <el-button icon="el-icon-search" @click="getCustData" type="success">搜索</el-button>
    </div>
    

    <el-table @row-click="clickRow" :data="tableData._list" style="width: 100%">
      <el-table-column prop="customName" label="客户名称">
      </el-table-column>
      <el-table-column label="客户性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender==0?'女':scope.row.gender==1?'男':'未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="客户电话">
      </el-table-column>
      <el-table-column prop="whetherTransfer" label="是否同事转移">
      </el-table-column>
      <el-table-column prop="customLevel" label="客户等级">
      </el-table-column>
      <el-table-column prop="area" label="所在地区">
      </el-table-column>
      <el-table-column prop="gainDate" label="获取日期">
      </el-table-column>
      <el-table-column prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-delete" @click.stop="deleteCustomer(scope.row)">释放客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />

    <!-- 添加客户弹窗 -->
    <el-dialog title="添加新客户" width="600px" :visible.sync="showAddCusDialog">
      <el-form :model="addCustForm"  :rules="addCustFormRules" ref="addCustForm">
        <div class="hn-fitem-box">
          <el-form-item label="客户姓名" prop="customName" required>
            <el-input v-model="addCustForm.customName" placeholder="请输入真实姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="phone" required>
            <el-input v-model="addCustForm.phone" placeholder="请输入登录账号" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="addCustForm.age" type="number" placeholder="请输入年龄" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="addCustForm.gender" placeholder="请选择性别">
              <el-option v-for="(item) in genderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showAddCusDialog = false">取 消</el-button>
        <el-button  type="primary" @click="addCustConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/custom/getCustomPage', { phone: "",customName: "",order:"id DESC" },'post'),
      value:"",
      options:[],
      
      showAddCusDialog:false,//添加客户弹窗

      searchForm:{

      },

      addCustForm:{
        "age": "",
        "phone": "",
        groupId:"",
        "phone": "",
        "customName": "",
        "roleId": "",
        "gender": 2
      },
      addCustFormRules: {
        customName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        phone: [
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
      genderOption:[
        {value:0,label:'女'},
        {value:1,label:'男'},
        {value:2,label:'未知'}
      ],
    }
  },
  created() {
    this.getCustData()
  },
  methods: {
    // 分页器页码、显示条数改变
    pagingChange(e) {
      console.log(e)
      this.tableData._page = e.page
      this.tableData._limit = e.limit
      this.getCustData()
    },
    // 行点击事件
    clickRow(row){
      localStorage.setItem("customId", row.id) //存储进入客户详情的客户id
      this.hnRouterPush('/customerInfo')
    },
    // 重置搜索条件
    resetSearchForm(){
      this.tableData._params.phone = ''
      this.tableData._params.customName = ''
      this.getCustData()
    },
    // 添加客户弹窗确定
    addCustConfirm(){

    },
    // 释放客户
    deleteCustomer(row){
      this.hnMsgBox().then(()=>{
        this.request("/custom/freeCustom",{customId:row.id},'post','form').then(res=>{
          if(res.code==0){
            this.getCustData()
            this.hnMsg()
          }
        })
      })
    },
    // 获取客户数据
    getCustData(){
      this.tableData.exec()
    },
    // 员工改变
    staffChange(e){
      console.log(e,"员工")
    },
    // 状态改变
    statusChange(e){
      console.log(e,"状态")
    },
    // 省份改变
    provChange(e){
      console.log(e,"省份")
    },
    // 城市改变
    cityChange(e){
      console.log(e,"城市")
    },
    // 省份改变
    areaChange(e){
      console.log(e,"地区")
    },
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
</style>