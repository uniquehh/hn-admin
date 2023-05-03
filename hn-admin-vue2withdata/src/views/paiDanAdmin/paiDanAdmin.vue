<template>
  <div class="hn-dtdict-main">

    <div class="hn-dict-search" v-if="!isChaoGuan()">
      <el-button type="primary" icon="el-icon-plus" @click="openADDialog">派单</el-button>
    </div>
    <div class="hn-dict-search">
      <!-- <div class="hn-dicts-left">
        <div class="hn-dictsl-text">客户名称：</div>
        <el-input placeholder="请输入客户名称" v-model="paiDanData._params.customName" class="hn-paiDansl-inp"></el-input>
      </div> -->
      <div class="hn-dicts-left">
        <el-input placeholder="请输入客户姓名" prefix-icon="el-icon-search" v-model="searchForm.customName"></el-input>
      </div>
      <div class="hn-dicts-left">
        <el-input placeholder="请输入客户手机号" prefix-icon="el-icon-search" v-model="searchForm.phone"></el-input>
      </div>
      <div class="hn-dicts-left">
        <el-input placeholder="请输入派单人" prefix-icon="el-icon-search" v-model="searchForm.userName"></el-input>
      </div>
      <!-- <div class="hn-dicts-left">
        <el-input placeholder="请输入项目" prefix-icon="el-icon-search" v-model="searchForm.project"></el-input>
      </div> -->
      <!-- <div class="hn-dicts-left">
        <el-select v-model="searchForm.followStatus" placeholder="请选择跟进状态">
          <el-option v-for="(item) in gjStatus" :key="item.value" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </div> -->
      <!-- <div class="hn-dicts-left">
        <el-select v-model="searchForm.gender" placeholder="请选择客户性别">
          <el-option v-for="(item) in sexOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div> -->
      <!-- <div class="hn-dicts-left">
        <el-select v-model="searchForm.dictId" placeholder="请选择客户来源">
          <el-option v-for="(item) in khLaiYuan" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
        </el-select>
      </div> -->
      <!-- <div class="hn-dicts-left">
        <el-select v-model="searchForm.groupId" placeholder="请选择所属小组">
          <el-option v-for="(item) in groupData._list" :key="item.id" :label="item.groupName" :value="item.id"></el-option>
        </el-select>
      </div> -->
      <!-- <div class="hn-dicts-left">
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
      <div class="hn-dicts-right">
        <el-button @click="resetSearchForm">重置</el-button>
        <el-button icon="el-icon-search" @click="searchPDData" type="primary">搜索</el-button>
      
      </div>
    </div>
    <el-table :data="paiDanData._list" style="width: 100%">
      <el-table-column prop="customName" label="客户名称">
      </el-table-column>
      <el-table-column label="客户性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender==0?'女':scope.row.gender==1?'男':'未知' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="客户电话">
      </el-table-column>
      <el-table-column prop="project" label="项目">
      </el-table-column>
      <el-table-column prop="userName" label="派单人">
      </el-table-column>
      <el-table-column prop="dictName" label="客户来源">
      </el-table-column>
      <el-table-column prop="dispatchTime" label="派单时间">
      </el-table-column>
      <el-table-column prop="followStatus" label="跟进状态">
      </el-table-column>
      <el-table-column prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getPaiDanRow(scope)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <pagination v-show="paiDanData._total>0" :total="paiDanData._total" 
      :page="paiDanData._page" 
      @pagination="pagingChange"
      :limit="paiDanData._limit" 
    />
    <!-- 添加派单 -->
    <el-dialog title="派单" width="600px" :visible.sync="showDIDialog">
      <el-form :model="addPaiDanForm"  :rules="addPaiDanFormRules" ref="addPaiDanForm">

        <div class="hn-fitem-box">
          <el-form-item label="客户姓名" required prop="customName">
            <el-input v-model="addPaiDanForm.customName" placeholder="请输入客户姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户来源" required prop="dictId">
            <el-select v-model="addPaiDanForm.dictId" placeholder="请选择客户来源">
              <el-option v-for="(item) in khLaiYuan" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="客户性别" required prop="gender">
            <el-select v-model="addPaiDanForm.gender" placeholder="请选择客户性别">
              <el-option v-for="(item) in sexOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="跟进状态" required prop="followStatus">
            <el-select v-model="addPaiDanForm.followStatus" placeholder="请选择跟进状态">
              <el-option v-for="(item) in gjStatus" :key="item.value" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="医院" required prop="hospitalIdList">
            <el-cascader
              clearable
              v-model="addPaiDanForm.hospitalIdList"
              :props="eYYFormProps"
              :options="chinaArea"
              placeholder="请选择医院"
              @change="editAreaChange"
              @expand-change="getAreaByParent"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="客户电话" required prop="phone">
            <el-input v-model="addPaiDanForm.phone" placeholder="请输入客户电话" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="项目" required prop="project">
            <el-input v-model="addPaiDanForm.project" placeholder="请输入项目" autocomplete="off"></el-input>
          </el-form-item>
        </div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button  @click="showDIDialog = false">取 消</el-button>
        <el-button  type="primary" @click="paiDanDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <paiDanInfo ref="paiDanInfo" :id="currPaiDanId"></paiDanInfo>
  </div>
</template>

<script>
import paiDanInfo from '@/components/paiDanInfo.vue'
import { Paging } from '@/util/paging'
export default {
  components: { paiDanInfo },
  data() {
    return {
      paiDanData: new Paging('/dispatch/getDispatchList', { order:"id DESC" },'post'),//派单数据
      groupData: new Paging('/group/getGroupPage', { order:"id DESC" },'post'),
      // 添加派单管理的表单
      addPaiDanForm: {
        "customName": "",
        "dictId": "",
        "followStatus": "暂时不跟进",
        "gender": 0,
        "hospitalIdList": [],
        "phone": "",
        "project": ""
      },
      addPaiDanFormRules: {
        customName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        dictId: [
          { required: true, message: '请选择客户来源', trigger: 'blur' },
        ],
        followStatus: [
          { required: true, message: '请选择跟进状态', trigger: 'blur' },
        ],
        gender: [
          { required: true, message: '请选择客户性别', trigger: 'blur' },
        ],
        hospitalIdList: [ // { validator: validateHospital, trigger: 'blur' },
          {type: 'array', required: true, message: '请选择医院', trigger: 'change'}
        ],
        phone: [
          { required: true, message: '请输入客户电话', trigger: 'blur' },
        ],
        project: [
          { required: true, message: '请输入项目', trigger: 'blur' },
        ],
      },
      sexOption:[
        {value:0,label:'女'},
        {value:1,label:'男'},
        {value:2,label:'未知'}
      ],
      gjStatus:[
        {value:0,label:'跟进'},
        {value:1,label:'暂时不跟进'},
      ],
      hospitalList:[],//医院数据
      currSelectedArea:{},//当前的省市级区域数据
      eYYFormProps:{
        value:'id',
        label:'name',
        children:'child',
        multiple: true
      },
      chinaArea:[],
      currCityCode2:"",//当前选择得城市得citycode
      currProvIndex:"",//当前操作得区省级区域下标
      currCityIndex:"",//当前操作得城市下标
      currCityCodeHistory:[],//当前已获取过得城市医院得citycode记录
      selectHospitalIds:[],//选中得医院id集合
      khLaiYuan:[],//客户来源字典数据
      showDIDialog:false,//是否显示派单管理弹窗
      currPaiDanId:0,//当前操作的派单id

      searchForm:{
        "customName": "",
        "dictId": "", //客户来源
        "dispatchBeginTime": "",
        "dispatchEndTime": "",
        gender:"",
        groupId:"",
        "phone": "",
        "project": "",
        "followStatus": "",
        "userName": "",
        times:"",
      },
    }
  },
  computed: {
    currDTInd() {
      return 0
    }
  },
  created() {
    this.getKeHuLaiYuan()
    this.getPaiDanData()
    this.getAreaData()
    this.getGroupData()
  },
  mounted() {

  },
  methods: {
    // 获取小组数据
    getGroupData() {
      this.groupData._limit = 200
      this.groupData.exec()
    },
    // 筛选派单数据
    searchPDData(){
      // console.log(this.searchForm,this.paiDanData)
      // this.searchForm.dispatchBeginTime = this.searchForm.times[0]
      // this.searchForm.dispatchEndTime = this.searchForm.times[1]
      this.paiDanData._params = Object.assign(this.paiDanData._params,this.searchForm)
      this.getPaiDanData()
    },
    // 重置搜索条件
    resetSearchForm(){
      this.searchForm = {
        "customName": "",
        "dictId": "", //客户来源
        "dispatchBeginTime": "",
        "dispatchEndTime": "",
        gender:"",
        groupId:"",
        "phone": "",
        "project": "",
        "followStatus": "",
        "userName": "",
        times:"",
      },
      this.paiDanData._params = Object.assign(this.paiDanData._params,this.searchForm)
      this.getPaiDanData()
    },
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
    // 获取省份
    async getAreaData(){
      // 若本地缓存没有全国区域数据，则请求接口获取
      let chinaArea = JSON.parse(window.localStorage.getItem('chinaArea'))
      if (this.isEmpty(chinaArea)) {
        this.chinaArea = await this.getChinaAreaList()
      }else{
        this.chinaArea = JSON.parse(JSON.stringify(chinaArea))
      }
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
        this.currCityCode2 = this.chinaArea[this.currProvIndex].child[this.currCityIndex].cityCode
        this.chinaArea[this.currProvIndex].child[this.currCityIndex].child = await this.getHospitalByCity()
      }
      
    },
    // 医院选择
    editAreaChange(value) {
      // console.log(value,88888)
      this.selectHospitalIds = []
      value.forEach(item=>{
        this.selectHospitalIds.push(item[2])
      })
      // console.log(this.selectHospitalIds)
    },
    // 获取城市下得医院
    getHospitalByCity(){
      return new Promise((rs,rj)=>{
        this.request('/hospital/getHospitalPage',{
          limit:200,
          page:1,
          cityCode:this.currCityCode2,
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

    // 派单弹窗确认
    paiDanDialogConfirm(){
      this.$refs.addPaiDanForm.validate((valid) => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.addPaiDanForm))
          obj.hospitalIdList = this.selectHospitalIds
          this.request("/dispatch/addDispatch",obj,'post').then((res)=>{
            if(res.code==0){
              this.getPaiDanData()
              this.hnMsg()
              this.showDIDialog = false
            }
          })

        } else {
          return false;
        }
      })
    },
    // 查看派单详情
    getPaiDanRow(scope) {
      this.currPaiDanId = scope.row.id
      const loading = this.$loading({
        lock: true,
        text: '数据加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      setTimeout(() => {
        loading.close();
        this.$refs.paiDanInfo.open()
      }, 500);
    },
    resetPaiDanForm(){
      this.addPaiDanForm = {
        "customName": "",
        "dictId": "",
        "followStatus": "暂时不跟进",
        "gender": 0,
        "hospitalIdList": [],
        "phone": "",
        "project": ""
      }
    },
    // 打开派单弹窗
    openADDialog() {
      this.showDIDialog = true
      this.resetPaiDanForm()
      //打开弹窗后移除其表单验证，防止先点击编辑再点击添加自动触发验证
      this.$nextTick(() => { 
        this.$refs.addPaiDanForm.clearValidate()
      })
    },
    // 获取派单管理数据
    getPaiDanData() {
      this.paiDanData.exec()
    },
    // 初始化分页、关键词数据
    resetPaging() {
      this.paiDanData._page = 1
      this.paiDanData._limit = 20
    },
    // 分页器页码、显示条数改变
    pagingChange(e) {
      this.paiDanData._page = e.page
      this.paiDanData._limit = e.limit
      this.getPaiDanData()
    },
  }
}
</script>

<style scoped lang="scss">
.hn-dict-search{
  margin-bottom: 20px;
  justify-content: unset;
  flex-wrap: wrap;
}
.hn-dtdict-main{
  padding:25px 30px;
}
.hn-dicts-left{
  margin-right: 10px;
  padding: 5px 0;
  flex-shrink: 0;
}
.hn-dicts-right{
  flex-shrink: 0;
}
</style>