<template>
  <div class="hn-index-main">
    <div class="hn-jiedanzx-main">
      <div class="hn-jdzxm-head">
        <div class="hn-jdzxmh-left">
          <img src="../assets/img/defAvatar.png" class="hn-jdzxmhl-img">
          <div class="hn-jdzxmhl-text">
            <div class="hn-jdzxmhlt-name">你好，{{ userInfo.realName }}</div>
            <!-- 现在是：2022-03-19 56:55:44 -->
            <div class="hn-jdzxmhlt-time">欢迎回来！</div>
          </div>
        </div>
        <!-- <div class="hn-jdzxmh-center">
          <el-switch
            v-model="value"
            active-text="开启接单"
            inactive-text="停止接单">
          </el-switch>
        </div> -->
        <div class="hn-jdzxmh-right">
          <div class="hn-jdzxmhr-item">
            <div class="hn-jdzxmhri-text">近30日新增客户</div>
            <div class="hn-jdzxmhri-num">{{ monthCustNum }}</div>
          </div>
          <div class="hn-jdzxmhr-line"></div>
          <div class="hn-jdzxmhr-item">
            <div class="hn-jdzxmhri-text">近30日新增派单</div>
            <div class="hn-jdzxmhri-num">{{ monthPDNum }}</div>
          </div>
          <div class="hn-jdzxmhr-line"></div>
          <div class="hn-jdzxmhr-item">
            <div class="hn-jdzxmhri-text">近30日完成跟进</div>
            <div class="hn-jdzxmhri-num">{{ monthWCGJNum }}</div>
          </div>
        </div>
      </div>
      <!-- 数据统计 -->
      <div class="hn-jdzxm-dcont">
        <div class="hn-jdzxmd-item">
          <div class="hn-jdzxmdi-left jdzxmdil-bg1">
            <i class="el-icon-customer"></i>
          </div>
          <div class="hn-jdzxmdi-right">
            <div class="hn-jdzxmdir-num">{{ dayCustNum }}</div>
            <div class="hn-jdzxmdir-text">今日新增客户</div>
          </div>
        </div>
        <div class="hn-jdzxmd-item">
          <div class="hn-jdzxmdi-left jdzxmdil-bg2">
            <i class="el-icon-document-checked"></i>
          </div>
          <div class="hn-jdzxmdi-right">
            <div class="hn-jdzxmdir-num">{{ dayPDNum }}</div>
            <div class="hn-jdzxmdir-text">今日新增派单</div>
          </div>
        </div>
        <div class="hn-jdzxmd-item">
          <div class="hn-jdzxmdi-left jdzxmdil-bg3">
            <i class="el-icon-date"></i>
          </div>
          <div class="hn-jdzxmdi-right">
            <div class="hn-jdzxmdir-num">{{ dayJHGJNum }}</div>
            <div class="hn-jdzxmdir-text">今日计划跟进</div>
          </div>
        </div>
        <div class="hn-jdzxmd-item">
          <div class="hn-jdzxmdi-left jdzxmdil-bg4">
            <i class="el-icon-finished"></i>
          </div>
          <div class="hn-jdzxmdi-right">
            <div class="hn-jdzxmdir-num">{{ dayWCGJNum }}</div>
            <div class="hn-jdzxmdir-text">今日完成跟进</div>
          </div>
        </div>
      </div>
      <!-- 主要内容 -->
      <div class="hn-jdzxm-mwrap">
        <div class="hn-jdzxmm-left">
          <div class="hn-custimc-bottom">
            <div class="hn-custimcm-head">
              <div class="hn-custimcmh-left">
                <i class="el-icon-user-solid"></i>
                <span class="hn-custimlth-text">今日新增客户</span>
                <!-- <span class="hn-custimlth-text2">-双击查看详情</span> -->
              </div>
              <!-- <i class="el-icon-dibudaohanglan-"></i> -->
            </div>
            <div class="hn-custm-warp">
              <el-table :data="dayCustList" style="width: 100%">
                <el-table-column prop="customName" label="客户名称">
                </el-table-column>
                <el-table-column label="客户性别">
                  <template slot-scope="scope">
                    <span>{{ scope.row.gender==0?'女':scope.row.gender==1?'男':'未知' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="客户电话">
                </el-table-column>
                <!-- <el-table-column prop="beLongUserName" label="所属用户">
                </el-table-column> -->
                <el-table-column prop="whetherTransfer" label="是否同事转移">
                  <template slot-scope="scope">
                    <span>{{ scope.row.whetherTransfer?'是':'否' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="customLevel" label="客户等级">
                </el-table-column>
                <!-- <el-table-column prop="area" label="所在地区">
                </el-table-column> -->
                <!-- <el-table-column prop="gainDate" label="获取日期">
                </el-table-column> -->
              </el-table>
            </div>
          </div>
        </div>
        <div class="hn-jdzxmm-center">
          <div class="hn-custimc-bottom">
            <div class="hn-custimcm-head">
              <div class="hn-custimcmh-left">
                <i class="el-icon-user-solid"></i>
                <span class="hn-custimlth-text">今日新增派单</span>
                <!-- <span class="hn-custimlth-text2">-双击查看详情</span> -->
              </div>
              <!-- <i class="el-icon-dibudaohanglan-"></i> -->
            </div>
            <div class="hn-custm-warp">
              <el-table :data="dayPDList" style="width: 100%">
                <el-table-column prop="customName" label="客户名称">
                </el-table-column>
                <el-table-column label="客户性别">
                  <template slot-scope="scope">
                    <span>{{ scope.row.gender==0?'女':scope.row.gender==1?'男':'未知' }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" width="100" label="客户电话">
                </el-table-column>
                <el-table-column prop="project" label="项目">
                </el-table-column>
                <!-- <el-table-column prop="userName" label="派单人">
                </el-table-column> -->
                <el-table-column prop="dictName" label="客户来源">
                </el-table-column>
                <!-- <el-table-column prop="dispatchTime" label="派单时间">
                </el-table-column> -->
                <el-table-column prop="followStatus" label="跟进状态">
                </el-table-column>
                <el-table-column prop="edit" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" @click="getPaiDanRow(scope)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="hn-jdzxmm-right">
          <div class="hn-custimc-bottom">
            <div class="hn-custimcm-head">
              <div class="hn-custimcmh-left">
                <i class="el-icon-user-solid"></i>
                <span class="hn-custimlth-text">今日计划跟进</span>
                <!-- <span class="hn-custimlth-text2">-双击查看详情</span> -->
              </div>
              <!-- <i class="el-icon-dibudaohanglan-"></i> -->
            </div>
            <div class="hn-custm-warp">
              <el-table :data="dayJHGJList" style="width: 100%">
                <el-table-column prop="followInfo" label="跟进内容">
                </el-table-column>
                <el-table-column label="下次跟进日期">
                  <template slot-scope="scope">
                    <span>{{ scope.row.nextFollowDate.split(' ')[0] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <paiDanInfo ref="paiDanInfo" :id="currPaiDanId"></paiDanInfo>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import paiDanInfo from '@/components/paiDanInfo.vue'
export default {
  components: { paiDanInfo },
  data() {
    return {
      value:'',
      tableData:[],

      dayCustNum: 0,//今日新增客户数量
      dayPDNum: 0,//今日新增派单数量
      dayJHGJNum: 0,//今日新增计划跟进数量
      dayWCGJNum: 0,//今日完成跟进数量
      monthCustNum: 0,//近30日新增客户数量
      monthPDNum: 0,//近30日新增派单数量
      monthWCGJNum: 0,//近30日完成跟进数量数量
      dayCustList:[],//今日新增客户列表
      dayPDList:[],//今日新增派单列表
      dayJHGJList:[],//今日新增计划跟进列表
      currPaiDanId:0,
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),
  },
  created(){
    this.getDayCustCont()
    this.getDayPDCont()
    this.getDayJHGJCont()
    this.getMonthCustCont()
    this.getMonthPDCont()
    this.getMonthWCGJCont()
    this.getDayWCGJCont()
    this.getDayCustList()
    this.getDayPDList()
    this.getDayJHGJList()

    this.getChinaAreaList()
  },
  methods: {
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
    // 获取今日新增客户数量
    getDayCustCont(){
      this.request('/index/getTodayCustomCount').then(res=>{
        if(res.code==0){
          this.dayCustNum = res.data
        }
      })
    },
    // 获取今日新增派单数量
    getDayPDCont(){
      this.request('/index/getTodayDispatchCount').then(res=>{
        if(res.code==0){
          this.dayPDNum = res.data
        }
      })
    },
    // 获取今日计划跟进数量
    getDayJHGJCont(){
      this.request('/index/getTodayPlanFollowCount').then(res=>{
        if(res.code==0){
          this.dayJHGJNum = res.data
        }
      })
    },
    // 获取今日完成跟进数量
    getDayWCGJCont(){
      this.request('/index/getTodayFollowResultCount').then(res=>{
        if(res.code==0){
          this.dayWCGJNum = res.data
        }
      })
    },
    // 近30日新增客户数量
    getMonthCustCont(){
      this.request('/index/getMonthCustomCount').then(res=>{
        if(res.code==0){
          this.monthCustNum = res.data
        }
      })
    },
    // 近30日新增派单数量
    getMonthPDCont(){
      this.request('/index/getMonthDispatchCount').then(res=>{
        if(res.code==0){
          this.monthPDNum = res.data
        }
      })
    },
    // 近30日完成跟进数量
    getMonthWCGJCont(){
      this.request('/index/getMonthFollowResultCount').then(res=>{
        if(res.code==0){
          this.monthWCGJNum = res.data
        }
      })
    },
    // 今日新增客户列表
    getDayCustList(){
      this.request('/index/getTodayCustomList').then(res=>{
        if(res.code==0){
          this.dayCustList = res.data
        }
      })
    },
    // 今日新增派单列表
    getDayPDList(){
      this.request('/index/getTodayDispatchList').then(res=>{
        if(res.code==0){
          this.dayPDList = res.data
        }
      })
    },
    // 今日计划跟进列表
    getDayJHGJList(){
      this.request('/index/getTodayPlanFollowList').then(res=>{
        if(res.code==0){
          this.dayJHGJList = res.data
        }
      })
    },

  }
}
</script>

<style scoped lang="scss">
.hn-index-main{
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
}
.hn-jiedanzx-main{
  height: 100%;
  // box-sizing: border-box;
}
.hn-jdzxm-mwrap{
  width: calc(100% - 0px);
  height: calc(100% - 166px);
  overflow: auto;
  padding-bottom: 27px;
  box-sizing: border-box;
}
.hn-jdzxmh-center{
  ::v-deep .el-switch__label *{
    font-size: 18px !important;
  }
}

</style>