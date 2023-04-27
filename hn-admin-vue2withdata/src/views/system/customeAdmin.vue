<template>
  <div class="hn-myctomer-main">
    <div class="hn-mcust-shbox">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="tableData._params.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户手机号" prefix-icon="el-icon-search" v-model="tableData._params.phone"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入所属用户姓名" prefix-icon="el-icon-search" v-model="tableData._params.beLongUserName"></el-input>
      <el-button @click="resetSearchForm">重置</el-button>
      <el-button icon="el-icon-search" @click="getCustData" type="success">搜索</el-button>
    </div>

    <el-table :data="tableData._list" style="width: 100%">
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
          <el-button type="primary" icon="el-icon-guide" @click.stop="moveCustomer(scope.row)">转移客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />

  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/custom/getAllCustom', { phone: "",customName: "",beLongUserName:"",order:"id DESC" },'post'),

    }
  },
  created() {
    this.getCustData()
  },
  methods: {
    moveCustomer(){
      // /custom/transferCustom
    },

    // 重置搜索条件
    resetSearchForm(){
      this.tableData._params.phone = ''
      this.tableData._params.customName = ''
      this.tableData._params.beLongUserName = ''
      this.getCustData()
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
    // 分页器页码、显示条数改变
    pagingChange(e) {
      console.log(e)
      this.tableData._page = e.page
      this.tableData._limit = e.limit
      this.getCustData()
    },
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
</style>