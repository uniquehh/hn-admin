<template>
  <div class="hn-myctomer-main">
    <div class="hn-mcust-shbox">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="tableData._params.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户手机号" prefix-icon="el-icon-search" v-model="tableData._params.phone"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入所属用户姓名" prefix-icon="el-icon-search" v-model="tableData._params.beLongUserName"></el-input>
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
      <el-table-column prop="beLongUserName" label="所属用户">
      </el-table-column>
      <el-table-column prop="customLevel" label="客户等级">
      </el-table-column>
      <el-table-column prop="area" label="所在地区">
      </el-table-column>
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" @click.stop="deleteCustomer(scope.row)">释放客户</el-button>
          <el-button type="text" icon="el-icon-guide" @click.stop="moveCustomer(scope.row)">转移客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />
    
    <!-- 转移客户弹窗 -->
    <el-dialog title="转移客户" width="400px" :visible.sync="showMCDialog">
      <el-form :model="moveCustForm"  :rules="moveCustFormRules" ref="moveCustForm">
        <el-form-item label="用户名称" prop="userId" required>
          <el-select style="width: 100%;" v-model="moveCustForm.userId" filterable placeholder="请选择同事">
            <el-option v-for="(item) in usStaff" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="showMCDialog = false">取 消</el-button>
        <el-button  type="primary" @click="mcDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/custom/getAllCustom', { phone: "",customName: "",beLongUserName:"",order:"id DESC" },'post'),
      usStaff: [],//可选择的同事
      showMCDialog: false,//转移客户弹窗
      moveCustForm: {
        customId: "",
        userId: "",
      },
      moveCustFormRules: {
        userId: [
          { required: true, message: '请选择同事', trigger: 'blur' },
        ],
      },
    }
  },
  async created() {
    this.getCustData()
    try {
      this.usStaff = await this.getUsableStaff() //可选择的同事
    } catch (error) {
      // console.log(this.usStaff)
    }
  },
  methods: {
    // 转移客户弹窗确认
    mcDialogConfirm() {
      this.$refs.moveCustForm.validate((valid) => {
        if (valid) {
          this.request("/custom/transferCustom", this.moveCustForm, 'post', 'form').then((res) => {
            if (res.code == 0) {
              this.getCustData()
              this.hnMsg()
              this.showMCDialog = false
            }
          })
        } else {
          return false
        }
      })
    },
    // 打开转移客户弹窗
    moveCustomer(row) { 
      this.moveCustForm.customId = row.id
      this.moveCustForm.userId = ''
      this.showMCDialog = true
      //userId 初始化会触发验证，所以打开弹窗时先清除验证
      this.$nextTick(() => { 
        this.$refs.moveCustForm.clearValidate()
      })
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