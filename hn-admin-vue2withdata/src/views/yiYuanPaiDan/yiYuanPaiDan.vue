<template>
  <div class="hn-myctomer-main">
    <div class="hn-yypd-search hn-mrb20">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="searchForm.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户手机号" prefix-icon="el-icon-search" v-model="searchForm.phone"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入派单人" prefix-icon="el-icon-search" v-model="searchForm.userName"></el-input>
      <!-- <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入项目" prefix-icon="el-icon-search" v-model="searchForm.project"></el-input> -->
      <!-- <el-select class="hn-mcust-shinp hn-mrr10" v-model="searchForm.status" placeholder="请选择状态">
        <el-option v-for="(item) in searchStOp" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select> -->
      <el-button @click="resetSearchForm">重置</el-button>
      <el-button icon="el-icon-search" @click="searchYYPDData" type="primary">搜索</el-button>
      
    </div>

    <!-- <div class="hn-yypd-search hn-mrb20">
      <el-date-picker
        class="hn-mrr10"
        v-model="searchForm.times"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="派单开始时间"
        end-placeholder="派单结束时间"
      ></el-date-picker>
      
    </div> -->
    

    <el-table :data="tableData._list" style="width: 100%">
      <el-table-column prop="customName" label="客户名称">
      </el-table-column>
      <el-table-column prop="phone" label="客户电话">
      </el-table-column>
      <el-table-column label="客户性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender==0?'女':scope.row.gender==1?'男':'未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="派单人">
      </el-table-column>
      <el-table-column prop="project" label="项目">
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ getPDStatusText(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dispatchTime" label="派单时间">
      </el-table-column>
      <el-table-column prop="edit"  label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="editYiYuanPaiDan(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />

    <!-- 处理医院派单弹窗 -->
    <el-dialog title="处理派单" width="400px" :visible.sync="showEYYPDDialog">
      <el-form :model="editYYPDForm"  :rules="editYYPDFormRules" ref="editYYPDForm">
        
        <el-form-item label="处理状态" prop="status">
          <el-select style="width: 100%;" v-model="editYYPDForm.status" placeholder="请选择处理状态">
            <el-option v-for="(item) in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEYYPDDialog = false">取 消</el-button>
        <el-button type="primary" @click="editYYPDConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/hospitalDispatch/getReceiveDispatchPage', { },'post'),
      
      showEYYPDDialog:false,//处理医院派单弹窗

      searchForm:{
        "customName": "",
        "dispatchBeginTime": "",
        "dispatchEndTime": "",
        "phone": "",
        "project": "",
        "status": "",
        "userName": "",
        times:"",
      },
      searchStOp:[
        {value:'NO_BACK',label:'未反馈'},
        {value:'NO_REPEAT',label:'不重'},
        {value:'REPEAT',label:'重单'},
        {value:'DEPTH',label:'深度'},
      ],
      editYYPDForm:{
        "dispatchId": "",
        "status": ""
      },
      editYYPDFormRules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: 'blur' },
        ],
      },
      statusOption:[
        {value:'NO_REPEAT',label:'不重'},
        {value:'REPEAT',label:'重单'},
        {value:'DEPTH',label:'深度'},
      ],
      currYYPDId:"",//当前操作得医院派单id
    }
  },
  created() {
    this.getYYPDData()
  },
  methods: {
    // 筛选派单数据
    searchYYPDData(){
      // console.log(this.searchForm,this.tableData)
      // this.searchForm.dispatchBeginTime = this.searchForm.times[0]
      // this.searchForm.dispatchEndTime = this.searchForm.times[1]
      this.tableData._params = Object.assign(this.tableData._params,this.searchForm)
      this.getYYPDData()
    },
    // 获取派单得状态label
    getPDStatusText(str){
      let obj = [
        {value:'NO_BACK',label:'未反馈'},
        {value:'NO_REPEAT',label:'不重'},
        {value:'REPEAT',label:'重单'},
        {value:'DEPTH',label:'深度'},
      ]
      let temp = obj.find(item=>item.value==str)
      return temp?temp.label:''
    },
    // 分页器页码、显示条数改变
    pagingChange(e) {
      // console.log(e)
      this.tableData._page = e.page
      this.tableData._limit = e.limit
      this.getYYPDData()
    },
    // 重置搜索条件
    resetSearchForm(){
      this.searchForm = {
        "customName": "",
        "dispatchBeginTime": "",
        "dispatchEndTime": "",
        "phone": "",
        "project": "",
        "status": "",
        "userName": "",
        times:"",
      },
      this.tableData._params = Object.assign(this.tableData._params,this.searchForm)
      this.getYYPDData()
    },
    // 处理医院派单弹窗确定
    editYYPDConfirm(){
      this.$refs.editYYPDForm.validate((valid) => {
        if (valid) {
          this.request("/hospitalDispatch/handleDispatch",this.editYYPDForm,'post','form').then(res=>{
            if(res.code==0){
              this.getYYPDData()
              this.showEYYPDDialog = false
              this.hnMsg()
            }
          })
        } else {
          return false;
        }
      })

    },
    // 处理医院派单
    editYiYuanPaiDan(row){
      this.currYYPDId = row.id
      this.editYYPDForm.dispatchId = row.id
      this.showEYYPDDialog = true
      this.$nextTick(() => {
        this.$refs.editYYPDForm.clearValidate()
      })
    },
    // 获取医院派单表格数据
    getYYPDData(){
      this.tableData.exec()
    },


    
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
.hn-mcust-shinp{
  width: 200px;
}
</style>