<template>
  <div class="hn-myctomer-main">
    <div class="hn-mctm-head" >
      <div class="hn-mctmh-left">
        <el-button class="hn-mctmhl-btn" icon="el-icon-plus" type="primary" @click="editCustome('add')">添加新客户</el-button>
      </div>
      <!-- <div class="hn-mctmh-right">
        <i class="hn-mctmhr-icon el-icon-refresh" @click="getCustData"></i>
        <i class="hn-mctmhr-icon el-icon-s-operation"></i>
      </div> -->
    </div>
    <div class="hn-mcust-shbox">
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="tableData._params.customName"></el-input>
      <el-input class="hn-mcust-shinp hn-mrr10" placeholder="请输入客户电话" prefix-icon="el-icon-search" v-model="tableData._params.phone"></el-input>
      <el-select class="hn-mcust-shinp hn-mrr10" clearable multiple v-model="tableData._params.userIdList" placeholder="请选择所属用户">
        <el-option v-for="(item) in belongUsers" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
      </el-select>
      <el-button @click="resetSearchForm">重置</el-button>
      <el-button icon="el-icon-search" @click="getCustData" type="primary">搜索</el-button>
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
      <el-table-column prop="beLongUserName" label="所属用户">
      </el-table-column>
      <el-table-column prop="dictName" label="客户来源">
      </el-table-column>
      <el-table-column prop="followStatus" label="跟进状态">
      </el-table-column>
      <el-table-column prop="customLevel" label="客户等级">
      </el-table-column>
      <el-table-column prop="area" label="所在地区">
      </el-table-column>
      <el-table-column prop="gainDate" label="获取日期">
      </el-table-column>
      <el-table-column  prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="deleteCustomer(scope.row)">释放客户</el-button>
          <el-button type="text" @click.stop="editCustome('edit',scope.row)">修改</el-button>
          <el-button v-if="isChaoGuan()" type="text" @click.stop="moveCustomer(scope.row)">转移客户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />

    <!-- 修改/添加弹窗 -->
    <el-dialog :title="editCustDiaTitle" width="600px" :visible.sync="showEditCusDialog">
      <el-form :model="editCustForm"  :rules="editCustFormRules" ref="editCustForm">
        <div class="hn-fitem-box">
          <el-form-item label="客户姓名" prop="customName" required>
            <el-input v-model="editCustForm.customName" placeholder="请输入客户姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户电话" prop="phone" required>
            <el-input :disabled="editCustDiaTitle=='编辑客户'" :maxlength="11" v-model="editCustForm.phone" placeholder="请输入客户电话" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="客户来源" required prop="dictId">
            <el-select :disabled="editCustDiaTitle=='编辑客户'" v-model="editCustForm.dictId" placeholder="请选择客户来源">
              <el-option v-for="(item) in khLaiYuan" :key="item.id" :disabled="item.dictBlock" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进状态" required prop="followStatus">
            <el-select v-model="editCustForm.followStatus" placeholder="请选择跟进状态">
              <el-option v-for="(item) in gjStatus" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="所在地区">
            <el-input v-model="editCustForm.area" placeholder="请输入客户所在地区" autocomplete="off"></el-input>
            <!-- 客户所在地区级联选择--暂时不用 -->
            <!-- <el-cascader
              ref="editCusArea"
              v-model="editCustForm.area"
              :props="eCustCasProps"
              :options="chinaArea"
              placeholder="请选择客户所在地区"
              @change="editAreaChange"
              @expand-change="getAreaByParent"
            ></el-cascader> -->
          </el-form-item>
          <el-form-item label="客户等级">
            <el-select v-model="editCustForm.customLevel" placeholder="请选择客户等级">
              <el-option v-for="(item) in customLevelOp" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="客户性别">
            <el-select v-model="editCustForm.gender" placeholder="请选择客户性别">
              <el-option v-for="(item) in genderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditCusDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCustConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 转移客户弹窗 -->
    <el-dialog title="转移客户" width="400px" :visible.sync="showMCDialog">
      <el-form :model="moveCustForm"  :rules="moveCustFormRules" ref="moveCustForm">
        <el-form-item label="用户名称" prop="userId" required>
          <el-select style="width: 100%;" v-model="moveCustForm.userId" placeholder="请选择同事">
            <el-option v-for="(item) in belongUsers" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showMCDialog = false">取 消</el-button>
        <el-button type="primary" @click="mcDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/custom/getCustomPage', { userIdList:[],phone: "",customName: "",order:"id DESC" },'post'),
      showEditCusDialog:false,//修改/添加弹窗
      editCustDiaTitle:"",//修改添加客户弹窗标题
      editCustForm:{
        "area": "",
        "customLevel": "",
        "customName": "",
        "gender": 0,
        "phone": "",
        dictId:"",
        followStatus:"暂时不跟进",
      },
      editCustFormRules: {
        // area: [
        //   { required: true, message: '请输入客户所在区域', trigger: 'blur' },
        // ],
        // customLevel: [
        //   { required: true, message: '请选择客户等级', trigger: 'blur' },
        // ],
        customName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        // gender: [
        //   { required: true, message: '请选择客户性别', trigger: 'blur' },
        // ],
        phone: [
          { required: true, validator:this.validatePhone, trigger: 'blur' },
        ],
        dictId: [
          { required: true, message: '请选择客户来源', trigger: 'blur' },
        ],
        followStatus: [
          { required: true, message: '请选择跟进状态', trigger: 'blur' },
        ],
      },
      genderOption:[
        {value:0,label:'女'},
        {value:1,label:'男'},
        {value:2,label:'未知'}
      ],
      customLevelOp:[
        {value:'A',label:'A'},
        {value:'B',label:'B'},
        {value:'C',label:'C'},
        {value:'D',label:'D'}
      ],
      belongUsers:[],
      moveCustForm: {
        customId: "",
        userId: "",
      },
      moveCustFormRules: {
        userId: [
          { required: true, message: '请选择同事', trigger: 'blur' },
        ],
      },
      showMCDialog: false,//转移客户弹窗
      gjStatus:[
        {value:0,label:'跟进'},
        {value:1,label:'暂时不跟进'},
      ],
      khLaiYuan:[],


      // 客户所在地区级联选择配置--暂时不用
      // eCustCasProps:{
      //   value:'cityCode',
      //   label:'name',
      //   children:'child'
      // },
      // chinaArea: [],//行政区域数据
    }
  },
  created() {
    this.getCustData()
    // this.getAreaData() //客户所在地区级联选择配置--暂时不用
    this.getUserList()
    this.getKeHuLaiYuan()
  },
  methods: {
    // 获取客户来源
    getKeHuLaiYuan(){
      this.request("/dict/getDictPage",{
        limit:200,
        page:1,
        order:"id DESC",
        dictType: "CUSTOMER_SOURCE"
      },'post').then((res)=>{
        if(res.code==0){
          this.khLaiYuan = res.data
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
    // 获取所有用户
    getUserList(){
      this.request('/custom/getUserSelectList').then(res=>{
        if(res.code==0){
          this.belongUsers = res.data
        }
      })
    },
    // 重置添加编辑客户表单数据
    resetEditCustForm(){
      this.editCustForm = {
        "area": "",
        "customLevel": "",
        "customName": "",
        "gender": 0,
        "phone": "",
        dictId:"",
        followStatus:"暂时不跟进",
      }
    },
    // 修改、添加客户
    editCustome(type,row){
      this.showEditCusDialog = true
      this.$nextTick(() => { 
        this.$refs.editCustForm.clearValidate()
      })
      this.editCustDiaTitle = type=='edit'?'编辑客户':'新增客户'
      type=='edit'?this.editCustForm = this.toJSON(row):this.resetEditCustForm()
    },

    // 分页器页码、显示条数改变
    pagingChange(e) {
      // console.log(e)
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
      this.tableData._params.userIdList = []
      this.getCustData()
    },
    // 修改/添加弹窗确定
    editCustConfirm(){
      this.$refs.editCustForm.validate((valid)=>{
        if(valid){
          if(this.editCustDiaTitle=='新增客户'){
            this.request('/custom/saveCustom',{
              "area": this.editCustForm.area,
              "customLevel": this.editCustForm.customLevel,
              "customName": this.editCustForm.customName,
              "gender": this.editCustForm.gender,
              "phone": this.editCustForm.phone,
              dictId:this.editCustForm.dictId,
              followStatus:this.editCustForm.followStatus,
            },'post').then(res=>{
              if(res.code==0){
                this.getCustData()
                this.hnMsg()
                this.showEditCusDialog = false
              }
            })
          }else{
            this.request('/custom/updateCustom',{
              "area": this.editCustForm.area,
              "customLevel": this.editCustForm.customLevel,
              "customName": this.editCustForm.customName,
              "gender": this.editCustForm.gender,
              "id": this.editCustForm.id,
              dictId:this.editCustForm.dictId,
              followStatus:this.editCustForm.followStatus,
            },'put').then(res=>{
              if(res.code==0){
                this.getCustData()
                this.hnMsg()
                this.showEditCusDialog = false
              }
            })
          }
          
        }else{
          return false
        }
      })
    },
    // 释放客户
    deleteCustomer(row){
      this.hnMsgBox('您确定要释放该客户吗？').then(()=>{
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



    // 客户所在地区级联选择配置--暂时不用
    // async getAreaData(){
    //   // 若本地缓存没有全国区域数据，则请求接口获取
    //   this.chinaArea = JSON.parse(window.localStorage.getItem('chinaArea')) || await this.getChinaAreaList()
    // },
    // async getAreaByParent(val){
    //   console.log(val,756)
    //   let pind = this.chinaArea.findIndex(item=>item.cityCode==val[0])
    //   let res = await this.getChinaAreaList({
    //     level:'1',
    //     cityCode:val[0]
    //   })
    //   this.chinaArea[pind].child = res
    // },
    // // 行政区域选择--添加
    // editAreaChange(value) {
    //   console.log(value)
    //   let pindex = this.chinaArea.findIndex(item=>item.cityCode==value[0])
    //   let province = this.chinaArea[pindex].name
    //   let city = this.chinaArea[pindex].child.find(item=>item.cityCode==value[1]).name
    //   console.log(this.eYYForm)
    // },
    
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
</style>