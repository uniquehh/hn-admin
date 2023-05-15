<template>
  <div class="hn-myctomer-main">
    <!--  -->
    <div class="hn-mctm-head" >
      <el-button class="hn-mctmhl-btn" icon="el-icon-plus" type="primary" @click="editChengDan('add')">新增成单</el-button>
    </div>
    <div class="hn-cdadmin-shbox hn-mrb20">
      <div class="hn-cdadmin-item" >
        <el-input placeholder="请输入成单医院" prefix-icon="el-icon-search" v-model="searchForm.hospitalName"></el-input>
      </div>
      <div class="hn-cdadmin-item" >
        <el-input placeholder="请输入成单用户" prefix-icon="el-icon-search" v-model="searchForm.userName"></el-input>
      </div>
      <div class="hn-cdadmin-item" >
        <el-input placeholder="请输入成单项目" prefix-icon="el-icon-search" v-model="searchForm.project"></el-input>
      </div>
      <div class="hn-cdadmin-item" >
        <el-date-picker
          v-model="searchForm.time"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="成单开始时间"
          end-placeholder="成单结束时间"
        ></el-date-picker>
      </div>
      <div class="hn-cdadmin-item">
        <el-button @click="resetSearchForm">重置</el-button>
        <el-button icon="el-icon-search" @click="searchPDData" type="primary">搜索</el-button>

      </div>
    </div>

    <el-table :data="tableData._list" style="width: 100%">
      <el-table-column prop="customName" label="成单客户">
      </el-table-column>
      <el-table-column prop="hospitalName" label="成单医院">
      </el-table-column>
      <el-table-column prop="userName" label="成单用户">
      </el-table-column>
      <el-table-column label="成单金额">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="project" label="成单项目">
      </el-table-column>
      <el-table-column label="成单时间">
        <template slot-scope="scope">
          <span>{{ scope.row.orderTime.split(" ")[0] }}</span>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column  prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="deleteChengDan(scope.row)">删除</el-button>
          <el-button type="text" @click.stop="editChengDan('edit',scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="tableData._total>0" :total="tableData._total" 
      :page="tableData._page" 
      @pagination="pagingChange"
      :limit="tableData._limit" 
    />

    <!-- 修改/添加弹窗 -->
    <el-dialog :title="editCDDiaTitle" width="600px" :visible.sync="showEditCDDialog">
      <el-form :model="editCDForm"  :rules="editCDFormRules" ref="editCDForm">
        <div class="hn-fitem-box">
          <el-form-item label="成单客户" prop="customId" required>
            <!-- v-infinite-scroll="getCustomers" 实现触底获取分页数据 -->
            <el-select v-model="editCDForm.customId" placeholder="请选择成单客户">
              <el-option
                v-for="item in customers"
                :key="item.customId"
                :label="item.customName"
                :value="item.customId"
              ></el-option>
              <!-- <p>加载中...</p>
              <p v-if="custPar.noMore">没有更多了</p> -->
            </el-select>
          </el-form-item>
          <el-form-item label="成单医院" prop="hospitalId" required>
            <el-cascader
              v-model="editCDForm.hospitalId"
              :props="selectYYProps"
              :options="chinaArea"
              placeholder="请选择成单医院"
              @expand-change="getAreaByParent"
              ></el-cascader>
              <!-- @change="editAreaChange" -->
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="成单金额" prop="amount" required>
            <el-input v-model="editCDForm.amount" placeholder="请输入成单金额" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="成单项目" prop="project" required>
            <el-input v-model="editCDForm.project" placeholder="请输入成单项目" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        
        <div class="hn-fitem-box">
          <el-form-item label="成单时间" prop="orderTime" required>
            <el-date-picker
              v-model="editCDForm.orderTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择成单时间">
            </el-date-picker>
          </el-form-item>
        </div>

        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showEditCDDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCDConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      tableData:new Paging('/order/getOrderPage', { order:"id DESC" },'post'),
      showEditCDDialog:false,//修改/添加弹窗
      editCDDiaTitle:"",//修改添加成单弹窗标题
      editCDForm:{
        "amount": "",
        "hospitalId": [],
        "orderTime": "",
        "customId": "",
        "project": ""
      },
      editCDFormRules: {
        amount: [
          { required: true, message: '请输入成单金额', trigger: 'blur' },
        ],
        hospitalId: [
          { type: 'array', required: true, message: '请选择成单医院', trigger: 'blur' },
        ],
        orderTime: [
          { required: true, message: '请选择成单时间', trigger: 'blur' },
        ],
        customId: [
          { required: true, message: '请选择成单客户', trigger: 'blur' },
        ],
        project: [
          { required: true, message: '请输入成单项目', trigger: 'blur' },
        ],
      },

      chinaArea: [],//行政区域数据
      currProvIndex:"",//当前操作得区省级区域下标
      currCityIndex:"",//当前操作得城市下标
      currCityCodeHistory:[],//当前已获取过得城市医院得citycode记录
      historyEditYYIds:[],//当前已获取过得城市医院得id记录
      selectYYProps:{
        value:'id',
        label:'name',
        children:'child',
      },
      searchForm:{
        "hospitalName": "",
        "orderBeginTime": "",
        "orderEndTime": "",
        "project": "",
        "userName": "",
        time:"",
      },
      customers:[],// 客户数据
      // custPar:{ //客户数据分页触底获取新数据参数--暂时不用
      //   page:0,
      //   limit:20,
      //   order:'id DESC',
      //   loading:false,
      //   noMore:false,
      // }
    }
  },
  created() {
    this.getCDData()
    this.getAreaData() //成单所在地区级联选择配置
    this.getCustomers()
  },
  methods: {
    // 获取客户数据
    getCustomers(){
      // this.custPar.page++
      // this.request('/custom/getCustomPage',this.custPar,'post').then(res=>{
      //   if(res.code==0){
      //     this.customers.push(...res.data)
      //   }
      // })
      this.request('/custom/getCustomSelectList',{},'get','form').then(res=>{
        if(res.code==0){
          this.customers = res.data
        }
      })
    },
    // 筛选派单数据
    searchPDData(){
      this.searchForm.orderBeginTime = this.searchForm.time[0]
      this.searchForm.orderEndTime = this.searchForm.time[1]
      this.tableData._params = Object.assign(this.tableData._params,this.searchForm)
      this.getCDData()
    },
    // 重置搜索条件
    resetSearchForm(){
      this.searchForm = {
        "hospitalName": "",
        "orderBeginTime": "",
        "orderEndTime": "",
        "project": "",
        "userName": "",
        time:"",
      }
      this.tableData._params = Object.assign(this.tableData._params,this.searchForm)
      this.getCDData()
    },

     // 根据省份得citycode获取城市数据
    async getCityByProv(pccode){
      let temp = this.currCityCodeHistory.find(item=>item==pccode)
      // 若已经获取过该省份下得城市数据，则不再获取
      if(temp)return;
      this.currCityCodeHistory.push(pccode)
      let res = await this.getChinaAreaList({
        level:'1',
        cityCode:pccode
      })
      res.forEach(item=>item.child=[])
      this.chinaArea[this.currProvIndex].child = res
    },
    // 获取城市、医院
    async getAreaByParent(val){
      // console.log(val,756)
      
      if(val.length==1){
        this.currProvIndex = this.chinaArea.findIndex(item=>item.id==val[0])
        this.getCityByProv(this.chinaArea[this.currProvIndex].cityCode)
      }

      if(val.length==2){
        this.currCityIndex = this.chinaArea[this.currProvIndex].child.findIndex(item=>item.id==val[1])
        let ccode = this.chinaArea[this.currProvIndex].child[this.currCityIndex].cityCode
        this.chinaArea[this.currProvIndex].child[this.currCityIndex].child = await this.getHospitalByCity(ccode)
      }
      
    },
    // 获取城市下得医院
    getHospitalByCity(ccode){
      return new Promise((rs,rj)=>{
        this.request('/hospital/getHospitalPage',{
          limit:200,
          page:1,
          cityCode:ccode,
          order:'id DESC'
        },'post').then((res)=>{
          if(res.code==0){
            rs(res.data)
          }else{
            rj(res)
          }
        })
      })
    },

    
    // 重置添加编辑成单表单数据
    resetEditCDForm(){
      this.editCDForm = {
        "amount": "",
        "hospitalId": [],
        "orderTime": "",
        "customId": "",
        "project": ""
      }
    },
    // 修改、添加成单
    async editChengDan(type,row){
      this.showEditCDDialog = true
      this.$nextTick(() => { 
        this.$refs.editCDForm.clearValidate()
      })
      this.editCDDiaTitle = type=='edit'?'编辑成单':'新增成单'

      type=='edit'?this.editCDHXForm(row):this.resetEditCDForm()
    },
    // 修改成单数据是的医院回显处理--需要传入行数据
    async editCDHXForm(row){
      // 若历已点击过就该，代表该医院数据已存在，不需要重新获取
      // console.log(this.historyEditYYIds)
      if(!this.historyEditYYIds.includes(row.id)){
        this.historyEditYYIds.push(row.id)
        // 获取城市数据
        let res = await this.getChinaAreaList({
          level:'1',
          cityCode:row.cityCode.slice(0,2)
        })
        res.forEach(item=>item.child = [])
        // 将城市数据给对应的省份
        let pindex = this.chinaArea.findIndex(item=>item.cityCode==row.cityCode.slice(0,2))
        this.chinaArea[pindex].child = res
        // 获取医院数据并给到对应的城市
        let cindex = this.chinaArea[pindex].child.findIndex(item=>item.cityCode==row.cityCode)
        let res2 = await this.getHospitalByCity(row.cityCode)
        this.chinaArea[pindex].child[cindex].child = res2
        let yyid = this.chinaArea[pindex].child[cindex].child.find(item=>item.id==row.hospitalId).id
        
        let hids = [this.chinaArea[pindex].id,this.chinaArea[pindex].child[cindex].id,yyid]
        this.editCDForm = this.toJSON(row)
        this.editCDForm.hospitalId = hids
      }else{
        let pindex = this.chinaArea.findIndex(item=>item.cityCode==row.cityCode.slice(0,2))
        let cindex = this.chinaArea[pindex].child.findIndex(item=>item.cityCode==row.cityCode)
        let yyid = this.chinaArea[pindex].child[cindex].child.find(item=>item.id==row.hospitalId).id
        let hids = [this.chinaArea[pindex].id,this.chinaArea[pindex].child[cindex].id,yyid]
        this.editCDForm = this.toJSON(row)
        this.editCDForm.hospitalId = hids
      }
      
      // console.log(this.editCDForm)
      
    },

    // 分页器页码、显示条数改变
    pagingChange(e) {
      // console.log(e)
      this.tableData._page = e.page
      this.tableData._limit = e.limit
      this.getCDData()
    },
    // 修改/添加弹窗确定
    editCDConfirm(){
      this.$refs.editCDForm.validate((valid)=>{
        if(valid){
          if(this.editCDDiaTitle=='新增成单'){
            this.request('/order/addOrder',{
              "amount": this.editCDForm.amount,
              "hospitalId": this.editCDForm.hospitalId[2],
              "orderTime": this.editCDForm.orderTime,
              "customId": this.editCDForm.customId,
              "project": this.editCDForm.project
            },'post').then(res=>{
              if(res.code==0){
                this.getCDData()
                this.hnMsg()
              }
            })
          }else{
            this.request('/order/updateOrder',{
              "amount": this.editCDForm.amount,
              "hospitalId": this.editCDForm.hospitalId[2],
              "orderTime": this.editCDForm.orderTime,
              "customId": this.editCDForm.customId,
              "project": this.editCDForm.project,
              "id": this.editCDForm.id
            },'put').then(res=>{
              if(res.code==0){
                this.getCDData()
                this.hnMsg()
              }
            })
          }
          this.showEditCDDialog = false
          
        }else{
          return false
        }
      })
    },
    // 删除成单
    deleteChengDan(row){
      this.hnMsgBox().then(()=>{
        this.request("/order/deleteOrder",{orderId:row.id},'delete','form').then(res=>{
          if(res.code==0){
            this.getCDData()
            this.hnMsg()
          }
        })
      })
    },
    // 获取成单数据
    getCDData(){
      this.tableData.exec()
    },

    async getAreaData(){
      // 若本地缓存没有全国区域数据，则请求接口获取
      this.chinaArea = JSON.parse(window.localStorage.getItem('chinaArea')) || await this.getChinaAreaList()
    },
    
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
.hn-fitem-box{
  ::v-deep .el-cascader{
    width: 250px;
  }
}
</style>