<template>
  <div class="hn-cusinfo-main">
    <!-- 左侧记录、转移 -->
    <div class="hn-custim-left">
      <div class="hn-custiml-telhis">
        <div class="hn-custimlt-head">
          <i class="el-icon-s-order"></i>
          <span class="hn-custimlth-text">跟进记录</span>
        </div>
        <div class="hn-gjlog-list">
          <div class="hn-custimlt-item" v-for="(item,index) in gjLog._list">
            <div class="hn-custimlti-left"></div>
            <div class="hn-custimlti-right">
              <div class="hn-custimltir-time">{{ item.createTime }}</div>
              <!-- <div class="hn-custimltir-user">
                <img class="hn-custimltiru-img" src="../../assets/img/defAvatar.png">
                <span>账号</span>
              </div> -->
              <div class="hn-custimltir-info">
                {{ item.info }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hn-custiml-movecut">
        <div class="hn-custimlt-head">
          <i class="el-icon-caret-bottom"></i>
          <span class="hn-custimlth-text">将此客户转移给同事</span>
        </div>
        <div class="hn-custm-warp">
          <el-form :model="moveCustForm" :rules="moveCustFormRules" label-width="80px" ref="moveCustForm">
            <el-form-item label="转移客户" required prop="userId">
              <el-select filterable clearable v-model="moveCustForm.userId" placeholder="请选择同事">
                <el-option v-for="(item) in usStaff" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="mcDialogConfirm">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 中间派单、跟进 -->
    <div class="hn-custim-center">
      <div class="hn-custimc-top">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-s-claim"></i>
            <span class="hn-custimlth-text">跟进结果</span>
          </div>
          <el-button icon="el-icon-plus" type="primary">派单</el-button>
        </div>
        <div class="hn-custm-warp">
          <el-input
            class="hn-custimcmt-inp"
            type="textarea"
            placeholder="请输入跟进结果"
            v-model="gjResult"
            maxlength="255"
            show-word-limit
          ></el-input>
          <el-button @click="confirmGJJG" icon="el-icon-s-promotion" type="primary">提交跟进结果</el-button>
        </div>
      </div>
      <div class="hn-custimc-center">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-date"></i>
            <span class="hn-custimlth-text">新增跟进计划</span>
          </div>
        </div>
        <div class="hn-custm-warp">
          <div class="hn-custimcc-th">
            <div class="hn-custimcct-text">跟进日期</div>
            <!-- <el-date-picker
              v-model="value"
              type="datetime"
              placeholder="请选择下次跟进日期">
            </el-date-picker> -->
            <el-date-picker v-model="value" type="date" placeholder="请选择下次跟进日期"></el-date-picker>
          </div>
          <div class="hn-custimcc-th">
            <div class="hn-custimcct-text">计划跟进内容</div>
            <el-input
              type="textarea"
              placeholder="请输入计划跟进内容"
              v-model="gjResult"
              maxlength="255"
              show-word-limit
            ></el-input>
          </div>
          <el-button icon="el-icon-plus" type="primary">提交跟进计划</el-button>
        </div>
      </div>
      <div class="hn-custimc-bottom">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">计划跟进任务</span>
          </div>
          <i class="el-icon-dibudaohanglan-"></i>
        </div>
        <div class="hn-custm-warp">
          <!-- <div class="hn-custimcc-th">
            <span style="margin-right: 10px;">是否关闭此客户跟进计划</span>
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div> -->
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="dictName" label="计划跟进日期">
            </el-table-column>
            <el-table-column prop="dictUse" label="计划内容">
              <!-- <template slot-scope="scope">
                <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span>
              </template> -->
            </el-table-column>
            <el-table-column prop="edit" label="创建时间">
              <!-- <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 右侧表单 -->
    <div class="hn-custim-right">
      <div class="hn-custimr-main">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">客户基本信息</span>
          </div>
        </div>
        <div class="hn-custm-warp">
          <el-form :model="editCustForm"  :rules="editCustFormRules" ref="editCustForm">
            <!-- <div class="hn-fitem-box">
              <el-form-item label="编号：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机：" style="width: 200px;">
                <el-input style="width: 145px;" v-model="form.name"></el-input>
              </el-form-item>
            </div> -->
            <el-form-item required prop="customName" label="姓名：">
              <el-input style="width: 215px;" v-model="editCustForm.customName" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
            <el-form-item required prop="gender" label="性别：">
              <el-select v-model="editCustForm.gender" placeholder="请选择客户性别">
                <el-option v-for="(item) in genderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item required prop="customName" label="地区：">
              <el-input style="width: 215px;" v-model="editCustForm.customName" placeholder="请输入客户所在地区"></el-input>
            </el-form-item>
            <el-form-item required prop="customLevel" label="等级：">
              <el-select v-model="editCustForm.customLevel" placeholder="请选择客户等级">
                <el-option v-for="(item) in customLevelOp" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <!-- <div class="hn-fitem-box">
              <el-form-item label="微信：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name" placeholder="请输入微信"></el-input>
              </el-form-item>
              <el-form-item label="QQ：" style="width: 200px;">
                <el-input style="width: 145px;" v-model="form.name" placeholder="请输入QQ"></el-input>
              </el-form-item>
            </div> -->

            <!-- <el-form-item label="计入系统日期：">
              <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" ></el-date-picker>
            </el-form-item> -->

            <!-- <el-form-item label="是否联系上：">
              <el-select v-model="form.region">
                <el-option label="是" value="beijing"></el-option>
                <el-option label="否" value="shanghai"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="来源：">
              <el-select v-model="form.region" disabled>
                <el-option label="是" value="beijing"></el-option>
                <el-option label="否" value="shanghai"></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="等级：">
              <el-radio-group v-model="form.resource">
                <el-radio label="A"></el-radio>
                <el-radio label="B"></el-radio>
              </el-radio-group>
            </el-form-item> -->

            <!-- <div class="hn-fitem-box">
              <el-form-item label="地区：" style="width: 100%;">
                <el-select style="width: 110px;margin-right: 10px;" v-model="form.region" placeholder="省">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
                <el-select style="width: 110px;margin-right: 10px;" v-model="form.region" placeholder="市">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
                <el-select style="width: 110px;" v-model="form.region" placeholder="区">
                  <el-option label="是" value="beijing"></el-option>
                  <el-option label="否" value="shanghai"></el-option>
                </el-select>
              </el-form-item>
            </div> -->
            
            <!-- <el-form-item label="备注：">
              <el-input type="textarea" placeholder="请输入备注" v-model="gjResult" maxlength="1024" show-word-limit></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="editCustConfirm" icon="el-icon-check">更新客户信息</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      value:"",



      moveCustForm:{
        userId: "",
        customId: "",
      },
      moveCustFormRules:{
        userId:[
          { required: true, message: '请选择同事', trigger: 'blur' },
        ]
      },
      gjResult:"",//跟进结果
      tableData: [],//客户跟进任务表格
      currCustomId: "",//当前的客户id
      usStaff:[],//可选择的同事

      gjjhForm:{
        "followInfo": "",
        "nextFollowDate": ""
      },
      editCustForm:{
        "area": "",
        "customLevel": "",
        "customName": "",
        "gender": 0,
      },
      editCustFormRules: {
        area: [
          { required: true, message: '请输入客户所在区域', trigger: 'blur' },
        ],
        customLevel: [
          { required: true, message: '请选择客户等级', trigger: 'blur' },
        ],
        customName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' },
        ],
        gender: [
          { required: true, message: '请选择客户性别', trigger: 'blur' },
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
      gjLog:new Paging('/follow/getFollowResultList', { order:"id DESC" },'post'),
    }
  },
  async created() {
    this.currCustomId = localStorage.getItem('customId')
    
    // console.log(this.currCustomId)
    this.usStaff = await this.getUsableStaff() //可选择的同事
    this.getCustData()
    this.getGenJinLog()
  },
  mounted() {

  },
  methods: {
    // 提交跟进结果
    confirmGJJG(){
      this.request('/follow/addFollowResult',{
        "customId": this.currCustomId,
        "info": this.gjResult
      },'post').then(res=>{
        if(res.code==0){
          this.getGenJinLog()
          this.gjResult = ''
          this.hnMsg()
        }
      })
    },
    // 获取跟进记录
    getGenJinLog(){
      this.gjLog._params.customId = this.currCustomId
      this.gjLog.exec()
    },
    // 提交跟进计划
    confirmGJJH(){
      this.request('/follow/addPlanFollow',{},'post')
    },
    // 更新客户信息
    editCustConfirm(){
      this.$refs.editCustForm.validate((valid)=>{
        if(valid){
          this.request('/custom/updateCustom',{
            "area": this.editCustForm.area,
            "customLevel": this.editCustForm.customLevel,
            "customName": this.editCustForm.customName,
            "gender": this.editCustForm.gender,
            "id": this.currCustomId
          },'put').then(res=>{
            if(res.code==0){
              this.getCustData()
              this.hnMsg()
            }
          })
        }else{
          return false
        }
      })
    },
    
    // 获取客户详情
    getCustData(){
      this.request('/custom/getCustomDetails',{
        customId:this.currCustomId
      }).then(res=>{
        if(res.code==0){
          this.editCustForm = res.data
        }
      })
    },
    // 转移客户提交
    mcDialogConfirm() {
      this.moveCustForm.customId = this.currCustomId
      this.$refs.moveCustForm.validate((valid) => {
        if (valid) {
          this.request("/custom/transferCustom", this.moveCustForm, 'post', 'form').then((res) => {
            if (res.code == 0) {
              this.hnMsg()
              setTimeout(() => {
                this.hnRouterBack()
              }, 1500);
            }
          })
        } else {
          return false
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">

</style>