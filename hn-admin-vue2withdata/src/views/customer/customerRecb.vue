<template>
  <div class="hn-myctomer-main">
    <div class="hn-mcust-shbox">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="tableData._params.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户电话" prefix-icon="el-icon-search" v-model="tableData._params.phone"></el-input>
      <el-button @click="resetSearchForm">重置</el-button>
      <el-button icon="el-icon-search" @click="getCustData" type="primary">搜索</el-button>
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
      <el-table-column prop="customLevel" label="客户等级">
      </el-table-column>
      <el-table-column prop="area" label="所在地区">
      </el-table-column>
      <el-table-column  prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="recycleCust(scope.row)">取回</el-button>
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
      tableData:new Paging('/custom/getCustomerSea', { phone: "",customName: "",order:"id DESC" },'post'),

    }
  },
  created() {
    this.getCustData()
  },
  methods: {
    //取回客户
    recycleCust(row){
      this.hnMsgBox("您确定要取回该客户吗？").then(()=>{
        this.request('/custom/getBackCustom',{
          customId:row.id
        },'get','form').then(res=>{
          if(res.code==0){
            this.getCustData()
            this.hnMsg()
          }
        })
      })
    },
    // 分页器页码、显示条数改变
    pagingChange(e) {
      // console.log(e)
      this.tableData._page = e.page
      this.tableData._limit = e.limit
      this.getCustData()
    },
    // 重置搜索条件
    resetSearchForm(){
      this.tableData._params.phone = ''
      this.tableData._params.customName = ''
      this.getCustData()
    },
    getCustData(){
      this.tableData.exec()
    },

    
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
</style>