<template>
  <div class="hn-pdcom-main">
    <el-dialog title="派单" width="600px" :visible.sync="showDIDialog">
      <el-form :model="addPaiDanForm"  :rules="addPaiDanFormRules" ref="addPaiDanForm">

        <div class="hn-fitem-box">
          <el-form-item label="客户姓名" required prop="customName">
            <el-input disabled v-model="addPaiDanForm.customName" placeholder="请输入客户姓名" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户来源" required prop="dictId">
            <el-select v-model="addPaiDanForm.dictId" placeholder="请选择客户来源">
              <el-option v-for="(item) in khLaiYuan" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="hn-fitem-box">
          <el-form-item label="客户性别" required prop="gender">
            <el-select disabled v-model="addPaiDanForm.gender" placeholder="请选择客户性别">
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
            <el-input disabled v-model="addPaiDanForm.phone" placeholder="请输入客户电话" autocomplete="off"></el-input>
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
  </div>
</template>

<script>
export default {
  props:{
    data:{
      type:Object,
      default:()=>{},
    }
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
    }
  },
  created(){
    this.getAreaData()
    this.getKeHuLaiYuan()
  },
  methods: {
    open(){
      this.showDIDialog = true
      this.resetPaiDanForm()
      this.$nextTick(() => { 
        this.$refs.addPaiDanForm.clearValidate()
      })
    },
    resetPaiDanForm(){
      this.addPaiDanForm.dictId = ""
      this.addPaiDanForm.followStatus = ""
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
        console.log(this.addPaiDanForm)
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
  }
}
</script>

<style scoped lang="scss">

</style>