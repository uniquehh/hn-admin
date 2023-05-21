<template>
  <div class="hn-pdcom-main">
    <el-dialog title="派单" width="600px" :visible.sync="showDIDialog">
      <el-form :model="addPaiDanForm"  :rules="addPaiDanFormRules" ref="addPaiDanForm">

        <div class="hn-ypdyy-list">
          <div class="hn-ypdyyl-head hn-mrb10">已派单医院</div>
          <el-tag
            v-for="item in ypdyyList"
            :key="item.hospitalId"
            :type="item.hospitalName"
            effect="dark"
            class="hn-mrr10 hn-mrb10"
          >
            {{ item.hospitalName }}
          </el-tag>
          <el-empty v-if="ypdyyList.length==0" description="暂无数据"></el-empty>
        </div>
        <div class="hn-fitem-box">
          <el-form-item label="未派单医院" required prop="hospitalIdList">
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
  </div>
</template>

<script>
export default {
  props:{
    data:{
      type:Object,
      default:()=>{},
    },
  },
  watch:{
    data:{
      deep:true,
      imimmediate:true,
      handler(val){
        // console.log(val,'watch')
        if(val){
          this.addPaiDanForm = Object.assign(this.addPaiDanForm,val)
          // console.log(this.addPaiDanForm,'watch2')
        }
      },
    },
  },
  data() {
    return {
      showDIDialog:false,//是否显示派单管理弹窗
      addPaiDanForm: {
        "hospitalIdList": [],
        "project": ""
      },
      addPaiDanFormRules: {
        hospitalIdList: [ // { validator: validateHospital, trigger: 'blur' },
          {type: 'array', required: true, message: '请选择医院', trigger: 'blur'}
        ],
        project: [
          { required: true, message: '请输入项目', trigger: 'blur' },
        ],
      },
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
      currCustomId:"",
      ypdyyList:[],
      ypdyyIds:[],//已派单医院id
    }
  },
  created(){
    this.currCustomId = localStorage.getItem('customId')
    this.getAreaData()
    this.getYPDYYList()
  },
  methods: {
    // 获取已派单医院
    getYPDYYList(){
      this.request('/dispatch/getHospitalDisList',{
        customId:this.currCustomId,
      },'get','form').then(res=>{
        if(res.code == 0){
          this.ypdyyList = res.data
          this.ypdyyIds = []
          res.data.forEach(item=>{
            this.ypdyyIds.push(item.hospitalId)
          })
        }
      })
    },
    open(){
      this.showDIDialog = true
      this.resetPaiDanForm()
      this.$nextTick(() => { 
        this.$refs.addPaiDanForm.clearValidate()
      })
    },
    resetPaiDanForm(){
      this.addPaiDanForm.hospitalIdList = []
      this.addPaiDanForm.project = ""
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
      this.chinaArea = JSON.parse(window.localStorage.getItem('chinaArea')) || await this.getChinaAreaList()
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
          order:'id DESC',
          hospitalIdList:this.ypdyyIds,
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
        // console.log(this.addPaiDanForm)
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.addPaiDanForm))
          obj.hospitalIdList = this.selectHospitalIds
          obj.customId = this.currCustomId
          this.request("/dispatch/addDispatch",obj,'post').then((res)=>{
            if(res.code==0){
              this.getYPDYYList()
              this.$emit('addPaiDan')
              this.hnMsg()
              this.showDIDialog = false
            }
          })

        } else {
          return false;
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">

</style>