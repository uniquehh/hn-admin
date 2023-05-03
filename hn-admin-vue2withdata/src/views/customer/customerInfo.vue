<template>
  <div class="hn-cusinfo-main">
    <!-- 左侧记录、转移 -->
    <div class="hn-custim-left">
      <div class="hn-custiml-telhis">
        <div class="hn-custimlt-head">
          <i class="el-icon-tickets"></i>
          <span class="hn-custimlth-text">跟进记录</span>
        </div>
        <div class="hn-gjlog-list" v-show="gjLog.length>0">
          <div class="hn-custimlt-item" v-for="(item,index) in gjLog">
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
        <el-empty v-show="gjLog.length==0" description="暂无数据"></el-empty>
      </div>
      <div class="hn-custiml-movecut">
        <div class="hn-custimlt-head">
          <i class="el-icon-caret-bottom"></i>
          <span class="hn-custimlth-text">将此客户转移给同事</span>
        </div>
        <div class="hn-custm-warp">
          <el-form :show-message="showMVRuleMsg" :model="moveCustForm" :rules="moveCustFormRules" label-width="80px" ref="moveCustForm">
            <el-form-item label="转移客户" required prop="userId">
              <el-select @change="showMVRuleMsg=false" filterable clearable v-model="moveCustForm.userId" placeholder="请选择同事">
                <el-option v-for="(item) in usStaff" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="!isChaoGuan()">
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
            <i class="el-icon-document-checked"></i>
            <span class="hn-custimlth-text">跟进结果</span>
          </div>
          <el-button v-if="!isChaoGuan()" @click="openPaiDan" icon="el-icon-plus" type="primary">派单</el-button>
        </div>
        <div class="hn-custm-warp">
          <el-form :model="gjResultForm" :show-message="showGJRuleMsg" :rules="gjResultFormRules" ref="gjResultForm">
            <el-form-item prop="gjResult" required>
              <el-input
                @change="showGJRuleMsg = false"
                type="textarea"
                placeholder="请输入跟进结果"
                v-model="gjResultForm.gjResult"
                maxlength="255"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
          <!-- v-if="!isChaoGuan()" -->
          <el-button v-if="!isChaoGuan()" @click="confirmGJJG" icon="el-icon-s-promotion" type="primary">提交跟进结果</el-button>
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
          <el-form :model="gjjhForm" :show-message="showGJJHRuleMsg" :rules="gjjhFormRules" ref="gjjhForm">
            <el-form-item prop="nextFollowDate" required>
              <div>
                <div class="hn-custimcct-text">跟进日期</div>
                <el-date-picker @change="showGJJHRuleMsg = false" value-format="yyyy-MM-dd" v-model="gjjhForm.nextFollowDate" type="date" placeholder="请选择下次跟进日期"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item prop="followInfo" required>
              <div>
                <div class="hn-custimcct-text">计划跟进内容</div>
                <el-input
                  @change="showGJJHRuleMsg = false"
                  type="textarea"
                  placeholder="请输入计划跟进内容"
                  v-model="gjjhForm.followInfo"
                  maxlength="255"
                  show-word-limit
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
          <el-button v-if="!isChaoGuan()" @click="confirmGJJH" icon="el-icon-plus" type="primary">提交跟进计划</el-button>
        </div>
      </div>
      <div class="hn-custimc-bottom">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">计划跟进任务</span>
          </div>
          <!-- <i @click="getGenJinJiHua" class="el-icon-dibudaohanglan-"></i> -->
        </div>
        <div class="hn-custm-warp">
          <!-- <div class="hn-custimcc-th">
            <span style="margin-right: 10px;">是否关闭此客户跟进计划</span>
            <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </div> -->
          <el-table :data="gjjhTable" style="width: 100%">
            <el-table-column label="计划跟进日期">
              <template slot-scope="scope">
                <span>{{ scope.row.nextFollowDate.split(' ')[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="followInfo" label="计划跟进内容">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column v-if="!isChaoGuan()" label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteGJJH(scope.row)" type="text">删除</el-button>
              </template>
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
          <el-form :model="editCustForm" label-width="70px" :show-message="showCustRuleMsg" :rules="editCustFormRules" ref="editCustForm">
            <!-- <div class="hn-fitem-box">
              <el-form-item label="编号：" style="width: 200px;">
                <el-input style="width: 130px;" v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="手机：" style="width: 200px;">
                <el-input style="width: 145px;" v-model="form.name"></el-input>
              </el-form-item>
            </div> -->
            <el-form-item required prop="customName" label="姓名：">
              <el-input @change="showCustRuleMsg = false" style="width: 215px;" v-model="editCustForm.customName" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
            <el-form-item required prop="gender" label="性别：">
              <el-select v-model="editCustForm.gender" placeholder="请选择客户性别">
                <el-option v-for="(item) in genderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item required prop="customName" label="地区：">
              <el-input @change="showCustRuleMsg = false" style="width: 215px;" v-model="editCustForm.area" placeholder="请输入客户所在地区"></el-input>
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
            <el-form-item v-if="!isChaoGuan()">
              <el-button type="primary" @click="editCustConfirm" icon="el-icon-check">更新客户信息</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <paiDanCom :data="pdDiData" ref="paiDanCom"></paiDanCom>
  </div>
</template>

<script>
import paiDanCom from '@/components/paiDanCom.vue'
export default {
  components:{paiDanCom},
  data() {
    return {

      moveCustForm:{
        userId: "",
        customId: "",
      },
      moveCustFormRules:{
        userId:[
          { required: true, message: '请选择同事', trigger: 'blur' },
        ]
      },
      showMVRuleMsg:false,
      gjResultForm:{
        gjResult:"",//跟进结果
      },
      gjResultFormRules:{
        gjResult:[
          { required: true, message: '请输入跟进结果', trigger: 'blur' },
        ],
      },
      showGJRuleMsg:false,//是否显示跟进结果校验文字
      gjjhTable: [],//客户跟进计划表格数据
      currCustomId: "",//当前的客户id
      usStaff:[],//可选择的同事

      gjjhForm:{
        "followInfo": "",
        "nextFollowDate": ""
      },
      gjjhFormRules:{
        followInfo:[
          { required: true, message: '请输入计划跟进内容', trigger: 'blur' },
        ],
        nextFollowDate:[
          { required: true, message: '请选择跟进日期', trigger: 'blur' },
        ],
      },
      showGJJHRuleMsg:false,//跟进计划校验错误信息是否显示
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
      showCustRuleMsg:false,
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
      gjLog:[],
      pdDiData:{ //传给派单弹窗的客户信息
        "customName": "",
        "gender": 0,
        "phone": "",
      },
    }
  },
  async created() {
    this.currCustomId = localStorage.getItem('customId')
    // console.log(this.currCustomId)
    this.usStaff = await this.getUsableStaff() //可选择的同事
    this.getCustData()
    this.getGenJinLog()
    this.getGenJinJiHua()
  },
  mounted() {

  },
  methods: {
    // 打开派单弹窗
    openPaiDan(){
      this.$refs.paiDanCom.open()
    },
    // 提交跟进结果
    confirmGJJG(){
      this.showGJRuleMsg = true
      this.$refs.gjResultForm.validate((valid)=>{
        if(valid){
          this.showGJRuleMsg = false
          this.request('/follow/addFollowResult',{
            "customId": this.currCustomId,
            "info": this.gjResultForm.gjResult
          },'post').then(res=>{
            if(res.code==0){
              this.getGenJinLog()
              this.gjResultForm.gjResult = ''
              this.$nextTick(()=>{
                this.$refs.gjResultForm.clearValidate()
              })
              this.hnMsg()
            }
          })
        }else{
          return false
        }
      })
      
    },
    // 获取跟进记录
    getGenJinLog(){
      this.request('/follow/getFollowResultList',{
        customId:this.currCustomId
      },'get','form').then(res=>{
        if(res.code==0){
          this.gjLog = res.data
        }
      })
    },
    // 删除跟进计划
    deleteGJJH(row){
      this.hnMsgBox().then(()=>{
        this.request("/follow/deletePlanFollow",{
          planFollowId:row.id
        },'delete','form').then(res=>{
          if(res.code==0){
            this.getGenJinJiHua()
            this.hnMsg()
          }
        })
      })
    },
    // 提交跟进计划
    confirmGJJH(){
      this.showGJJHRuleMsg = true
      this.$refs.gjjhForm.validate((valid)=>{
        if(valid){
          this.showGJJHRuleMsg = false
          this.request('/follow/addPlanFollow',{
            "customId": this.currCustomId,
            "followInfo": this.gjjhForm.followInfo,
            "nextFollowDate": this.gjjhForm.nextFollowDate
          },'post').then(res=>{
            if(res.code==0){
              this.getGenJinJiHua()
              this.gjjhForm.followInfo = ''
              this.gjjhForm.nextFollowDate = ''
              this.$nextTick(()=>{
                this.$refs.gjjhForm.clearValidate()
              })
              this.hnMsg()
            }
          })
        }else{
          return false
        }
      })
    },
    // 获取跟进计划列表
    getGenJinJiHua(){
      this.request('/follow/getPlanFollowList',{
        customId:this.currCustomId
      },'get','form').then(res=>{
        if(res.code==0){
          this.gjjhTable = res.data
        }
      })
    },
    // 更新客户信息
    editCustConfirm(){
      this.showCustRuleMsg = true
      this.$refs.editCustForm.validate((valid)=>{
        if(valid){
          this.showCustRuleMsg = false
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
          this.pdDiData.customName = res.data.customName
          this.pdDiData.gender = res.data.gender
          this.pdDiData.phone = res.data.phone
          // console.log(this.pdDiData)
        }
      })
    },
    // 转移客户提交
    mcDialogConfirm() {
      this.moveCustForm.customId = this.currCustomId
      this.showMVRuleMsg = true
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