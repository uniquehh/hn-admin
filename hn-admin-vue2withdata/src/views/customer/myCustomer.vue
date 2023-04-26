<template>
  <div class="hn-myctomer-main">
    <div class="hn-mctm-head">
      <div class="hn-mctmh-left">
        <el-button class="hn-mctmhl-btn" icon="el-icon-plus" type="primary" @click="showAddCusDialog=true">添加新客户</el-button>
        <span class="hn-mctmhl-text">右侧“刷新”按钮可以帮助更新页面数据</span>
      </div>
      <div class="hn-mctmh-right">
        <i class="hn-mctmhr-icon el-icon-refresh" @click="getCustData"></i>
        <i class="hn-mctmhr-icon el-icon-s-operation"></i>
      </div>
    </div>
    <el-row class="hn-mctm-search" :gutter="20">
      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" @change="staffChange" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="statusChange" placeholder="全部状态">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-input placeholder="请输入手机号" prefix-icon="el-icon-search" v-model="tableData._params.phone">  </el-input>
      </el-col>
      
      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-date-picker v-model="value" type="date" placeholder="请选择日期"></el-date-picker>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="provChange" placeholder="全部省份">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="cityChange" placeholder="全部城市">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="areaChange" placeholder="全部地区">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-button icon="el-icon-search" @click="getCustData" type="success">搜索</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData._list" style="width: 100%">
      <el-table-column label="客户名称">
        <template slot-scope="scope">
          <el-button type="text" @click="hnRouterPush({path:'/customerInfo',query:{id:scope.row.id}})">{{ scope.row.customName }}</el-button>
        </template>
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
          <el-button type="warning" icon="el-icon-delete" @click="deleteCustomer(scope.row)">释放客户</el-button>
        </template>
      </el-table-column>
    </el-table>

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
      
      currCustId:"",//当前操作得客户id
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
    // 重置搜索条件
    resetSearchForm(){

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