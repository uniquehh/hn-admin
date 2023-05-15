<template>
  <div class="hn-cusinfo-main">
    <div class="hn-custim-left">
      <div class="hn-custimc-top">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-document-checked"></i>
            <span class="hn-custimlth-text">跟进结果</span>
          </div>
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
          <!--  -->
          <el-button  @click="confirmGJJG" icon="el-icon-s-promotion" type="primary">提交跟进结果</el-button>
        </div>
      </div>
      <div class="hn-custiml-telhis">
        <div class="hn-custimlt-head">
          <i class="el-icon-tickets"></i>
          <span class="hn-custimlth-text">跟进记录</span>
        </div>
        <el-table :data="gjLog._list" style="width: 100%">
          <el-table-column prop="createTime" label="跟进时间">
          </el-table-column>
          <el-table-column prop="info" label="跟进内容">
          </el-table-column>
        </el-table>
        <pagination 
          v-show="gjLog._total > 0" 
          :total="gjLog._total" 
          :page="gjLog._page" 
          :limit="gjLog._limit"
          layout='total, prev, pager, next'
          @pagination="gjlogPageChange" 
        />
        <!-- <div class="hn-gjlog-list" v-show="gjLog._list.length>0">
          <div class="hn-custimlt-item" v-for="(item,index) in gjLog" :key="index">
            <div class="hn-custimlti-left"></div>
            <div class="hn-custimlti-right">
              <div class="hn-custimltir-time">{{ item.createTime }}</div>
              <div class="hn-custimltir-info">
                {{ item.info }}
              </div>
            </div>
          </div>
        </div> -->
      </div>

    </div>
    <!-- 中间派单、跟进 -->
    <div class="hn-custim-center">
      <div class="hn-custimc-center">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-date"></i>
            <span class="hn-custimlth-text">新增预约</span>
          </div>
          <el-button @click="openPaiDan" icon="el-icon-plus" type="primary">派单</el-button>
        </div>
        <div class="hn-custm-warp">
          <el-form :model="yuYueForm" :show-message="showYYRuleMsg" :rules="yuYueFormRules" ref="yuYueForm">
            <el-form-item prop="subDate" required>
              <div>
                <div class="hn-custimcct-text">预约日期</div>
                <el-date-picker v-model="yuYueForm.subDate" @change="showYYRuleMsg = false" value-format="yyyy-MM-dd" type="date" placeholder="请选择预约日期"></el-date-picker>
              </div>
            </el-form-item>
          </el-form>
          <el-button  @click="confirmYY" icon="el-icon-plus" type="primary">提交预约</el-button>
        </div>
      </div>
      <div class="hn-custimc-bottom">
        <div class="hn-custimcm-head">
          <div class="hn-custimcmh-left">
            <i class="el-icon-user-solid"></i>
            <span class="hn-custimlth-text">预约任务</span>
          </div>
          <!-- <i @click="getGenJinJiHua" class="el-icon-dibudaohanglan-"></i> -->
        </div>
        <div class="hn-custm-warp">
          <el-table :data="yyList._list" style="width: 100%">
            <el-table-column prop="subDate" label="预约日期">
              <template slot-scope="scope">
                <span>{{ scope.row.subDate.split(' ')[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="subPhone" label="预约客户电话">
            </el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteYY(scope.row)" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination 
            v-show="yyList._total > 0" 
            :total="yyList._total" 
            :page="yyList._page" 
            :limit="yyList._limit"
            layout='total, prev, pager, next'
            @pagination="yyPageChange" 
          />
        </div>
      </div>
    </div>
    <!-- 右侧表单 -->
    <div class="hn-custim-right">
      <div class="hn-custimr-main hn-mrb10">
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
              <el-input class="hn-custmw-inp" @change="showCustRuleMsg = false" v-model="editCustForm.customName" placeholder="请输入客户姓名"></el-input>
            </el-form-item>
            <el-form-item required prop="gender" label="性别：">
              <el-select class="hn-custmw-inp" v-model="editCustForm.gender" placeholder="请选择客户性别">
                <el-option v-for="(item) in genderOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item required prop="customName" label="地区：">
              <el-input class="hn-custmw-inp" @change="showCustRuleMsg = false" v-model="editCustForm.area" placeholder="请输入客户所在地区"></el-input>
            </el-form-item>
            <el-form-item required prop="customLevel" label="等级：">
              <el-select class="hn-custmw-inp" v-model="editCustForm.customLevel" placeholder="请选择客户等级">
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
            <el-form-item >
              <el-button type="primary" @click="editCustConfirm" icon="el-icon-check">更新客户信息</el-button>
            </el-form-item>
          </el-form>
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
          <el-button  @click="confirmGJJH" icon="el-icon-plus" type="primary">提交跟进计划</el-button>
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
          <el-table :data="gjjhTable._list" style="width: 100%">
            <el-table-column label="计划跟进日期">
              <template slot-scope="scope">
                <span>{{ scope.row.nextFollowDate.split(' ')[0] }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="followInfo" label="计划跟进内容">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteGJJH(scope.row)" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination 
            v-show="gjjhTable._total > 0" 
            :total="gjjhTable._total" 
            :page="gjjhTable._page" 
            :limit="gjjhTable._limit"
            layout='total, prev, pager, next'
            @pagination="gjjhPageChange" 
          />
        </div>
      </div>

    </div>
    <paiDanCom :data="pdDiData" ref="paiDanCom"></paiDanCom>
  </div>
</template>

<script>
import paiDanCom from '@/components/paiDanCom.vue'
import { Paging } from '@/util/paging'
export default {
  components:{paiDanCom},
  data() {
    return {
      gjResultForm:{
        gjResult:"",//跟进结果
      },
      gjResultFormRules:{
        gjResult:[
          { required: true, message: '请输入跟进结果', trigger: 'blur' },
        ],
      },
      showGJRuleMsg:false,//是否显示跟进结果校验文字

      yuYueForm:{
        subDate:"",//预约日期
      },
      yuYueFormRules:{
        subDate:[
          { required: true, message: '请选择预约日期', trigger: 'blur' },
        ],
      },
      showYYRuleMsg:false,//是否显示跟进结果校验文字
      yyList:new Paging('/sub/getSubPage', { subCustomId: "",order:"id DESC" },'post'),

      gjjhTable: new Paging('/follow/getPlanFollowList', { customId: "",order:"id DESC" },'post'),//客户跟进计划表格数据
      currCustomId: "",//当前的客户id

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
      gjLog:new Paging('/follow/getFollowResultList', { customId: "",order:"id DESC" },'post'),
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
    this.getCustData()
    this.getGenJinLog()
    this.getGenJinJiHua()
    this.getYYList()
  },
  methods: {
    // 跟进结果分页器
    gjlogPageChange(e){
      this.gjLog._page = e.page
      this.gjLog._limit = e.limit
      this.getGenJinLog()
    },
    // 预约分页器
    yyPageChange(e){
      this.yyList._page = e.page
      this.yyList._limit = e.limit
      this.getYYList()
    },
    // 跟进计划分页器
    gjjhPageChange(e){
      this.gjjhTable._page = e.page
      this.gjjhTable._limit = e.limit
      this.getGenJinJiHua()
    },
    // 删除预约
    deleteYY(row){
      this.hnMsgBox().then(()=>{
        this.request("/sub/deleteSub",{
          subId:row.id
        },'delete','form').then(res=>{
          if(res.code==0){
            this.getYYList()
            this.hnMsg()
          }
        })
      })
    },
    // 获取预约列表
    getYYList(){
      this.yyList._params.subCustomId = this.currCustomId
      this.yyList.exec()
    },
    // 提交预约
    confirmYY(){
      this.showYYRuleMsg = true
      this.$refs.yuYueForm.validate((valid)=>{
        if(valid){
          this.showYYRuleMsg = false
          this.request('/sub/saveSub',{
            "subCustomId": this.currCustomId,
            "subDate": this.yuYueForm.subDate
          },'post').then(res=>{
            if(res.code==0){
              this.getYYList()
              this.yuYueForm.subDate = ''
              this.$nextTick(()=>{
                this.$refs.yuYueForm.clearValidate()
              })
              this.hnMsg()
            }
          })
        }else{
          return false
        }
      })
    },
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
      this.gjLog._params.customId = this.currCustomId
      this.gjLog.exec()
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
      this.gjjhTable._params.customId = this.currCustomId
      this.gjjhTable.exec()
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


  }
}
</script>

<style scoped lang="scss">

</style>