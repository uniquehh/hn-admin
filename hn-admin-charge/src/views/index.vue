<template>
  <div class="root-height">
    <div class="bgc-img">

      <div class="dataDescription">

        <div class="dataDes-item">

          <div class="dataDes-item-img">
          </div>

          <div class="dataDes-item-des" style="color:#fff;">
            <div class="dataDes-item-des-font1">累计充电数(度)</div>
            <div class="dataDes-item-des-font2">{{parseFloat(optionsPars.totalCharge).toFixed(2)}}</div>
          </div>

        </div>

        <div class="dataDes-item">

          <div class="dataDes-item-img other1">
          </div>

          <div class="dataDes-item-des" style="color:#fff;">
            <div class="dataDes-item-des-font1">累计充电金额(元)</div>
            <div class="dataDes-item-des-font2">{{parseFloat(optionsPars.totalMoney).toFixed(2)}}</div>
          </div>

        </div>

        <div class="dataDes-item">

          <div class="dataDes-item-img other2">
          </div>

          <div class="dataDes-item-des" style="color:#fff;">
            <div class="dataDes-item-des-font1">累计充电次数(次)</div>
            <div class="dataDes-item-des-font2">{{optionsPars.chargeTimes}}</div>
          </div>

        </div>

        <div class="dataDes-item">

          <div class="dataDes-item-img other3">
          </div>

          <div class="dataDes-item-des" style="color:#fff;">
            <div class="dataDes-item-des-font1">合计接入项目数(个)</div>
            <div class="dataDes-item-des-font2">{{optionsPars.projectAmount}}</div>
          </div>

        </div>



      </div>

      <div class="dataInfo">

        <div class="dataInfo1">
          <div class="dataInfo1-item1 dataInfo1-item" style="color:#fff">
            <div class="info1-item-img1"></div>
            <div class="info1-item-font1">今日充电量(度)</div>
            <div class="info1-item-font2">{{parseFloat(optionsPars.todayTotalCharge).toFixed(2)}}</div>
          </div>
          <div class="dataInfo1-item2 dataInfo1-item" style="color:#fff">
            <div class="info1-item-img2"></div>
            <div class="info1-item-font1">今日充电金额(元)</div>
            <div class="info1-item-font2">{{parseFloat(optionsPars.todayTotalMoney).toFixed(2)}}</div>
          </div>
        </div>

        <div class="dataInfo2">
          <div class="dataInfo2-title">终端监控</div>
          <div class="dataInfo2-info">
            <div class="info2-item">
              <div class="info2-item-img"></div>
              <div class="info2-item-info">
                <div class="item-info-font1">{{optionsPars.chargingPileAmount}}</div>
                <div class="item-info-font2">充电中</div>
              </div>
            </div>
            <div class="info2-item">
              <div class="info2-item-img info2-item-img1"></div>
              <div class="info2-item-info">
                <div class="item-info-font1">{{optionsPars.freePileAmount}}</div>
                <div class="item-info-font2">空闲中</div>
              </div>
            </div>
            <div class="info2-item">
              <div class="info2-item-img info2-item-img2"></div>
              <div class="info2-item-info">
                <div class="item-info-font1">{{optionsPars.faultPileAmount}}</div>
                <div class="item-info-font2">故障</div>
              </div>
            </div>
          </div>
        </div>

        <div class="dataInfo3">
          <div class="dataInfo2-title" style="margin:0;">站点充电度数排行（度）</div>
          <div class="dataInfo3-list" v-for="(item,index) in optionsPars.stationRank" :key="index">
            <div class="dataInfo3-list-befor">
              <div class="list-item-index">{{index + 1}}</div>
              <div class="list-item-content">{{item.name}}</div>
            </div>
            <div class="dataInfo3-list-after">{{parseFloat(item.totalCharge).toFixed(2)}}</div>
          </div>
        </div>

      </div>
      <div class="dataEcharts">
        <div class="discountE">
          <div class="dataInfo2-title" style="margin-top:0">近7天内充电费用走势（元）</div>
          <div class="discountE-left">
            <leftdiscount :costs = optionsPars.costs v-if="optionsPars.costs&&ttt"></leftdiscount>
          </div>
        </div>
        <div class="mapE">
          <div class="mapEdes">
            <div class="mapEdes-item mapDes-margin">电站数：{{optionsPars.stationAmount}}</div>
            <div class="mapEdes-item">电桩数:{{ optionsPars. pileAmount}}</div>
          </div>
          <div class="discountE-right">
            <rightmap :stationAreaAmount="optionsPars.stationAreaAmount" v-if="optionsPars.stationAreaAmount&&ttt"></rightmap>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import leftdiscount from "../components/indexEcharts/leftdiscount";
  import rightmap from '../components/indexEcharts/rightmap';
  import request from '@/utils/request'

  export default {
    name: "user",
    data() {
      return {
        ttt:false,
        // 获取到的参数
        optionsPars:{
          chargeTimes:0, //累计充电次数
          chargingPileAmount:0, //充电中数量
          costs:[], //近7天内充电费用走势（元） // date 日期 // money 充电费用(元)
          faultPileAmount:0, //故障数量
          freePileAmount:0, //空闲中数量
          pileAmount:0, // 电桩数量
          projectAmount:0, //接入项目数
          stationAmount:0, //电站数量
          stationAreaAmount:[], //地区充电中分布情况 // name 省 // pileAmount 电桩数量 // stationAmount 电站数量
          stationRank:[], //站点充电度数排行（度） // name 站点名称 // num  排名 // totalCharge 总充电量
          todayTotalCharge:0, // 今日累计充电量（度）
          todayTotalMoney:0, // 今日累计充电金额（元）
          totalCharge:0, // 累计充电量（度）
          totalMoney:0 // 累计充电金额（元）
        },
        // -----------
        areaCode: '000000000000', // 当前用的areaCode
        areaLevel: 0, // 当前用的areaCode
        areaName: 'china', // 当前用的areaName
        mapNameList: [], // 当前地图上的地区名字
        mapCodeList: [], // 当前地图上的地区Code
        largescreenPcStyle: {
          position: 'fixed',
          top: 0,
          left: 0,
        },
        queryParams: {},
        areaStatistic: [], // 测试
        amounts: 0, // 测试
        dayStaCount: [], // 测试
        satisfied: {}, // 测试
        timedComplain: [], // 测试
        todayPvNumber: [], // 测试
        daTjInformation: [], // 测试
        daTjItemsInfo: [], // 测试
        complaintOverview: {}, // 测试
        pageview: {}, // 测试
        totalPublish: 0, // 测试
        totalItems: 0, // 测试
        thirdPlatform: 0, // 测试
        dateRange: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      };
    },
    components: {
      leftdiscount,
      rightmap
    },
    mounted() {
      this.getData()
    },
    created() {
      this.getOptionsParmas() //获取左边数值
      this.setAreaName()
    },
    watch: {
      areaCode: {
        handler(val) {
          this.getData()
        },
        deep: true
      }
    },
    methods: {

      getOptionsParmas(){
        request({
				url: '/system/statistics/queryHomeStatistics',
				method: 'get',
			}).then((res) => {
        this.optionsPars = res.data
        localStorage.setItem('mapOptions',JSON.stringify(this.optionsPars.stationAreaAmount))
        this.ttt = true
			}).catch(() => {
			});
      },


      // 设置areaName
      setAreaName() {
        if (this.areaName === '中央本级') {
          this.areaName = 'china'
        }
      },

      // 时间change
      onDateRangeChange(val) {
        this.getData()
      },
      getData() {
        this.requestGetSumComplaint() // 测试
        this.requestGetSumPvNumber() // 测试
        this.requestGetComplainStatistic() // 测试
        this.requestGetSatisfied() // 测试
        this.requestGetTimedComplain() // 测试
        this.requestGetDaTjInformation() // 测试
        this.requestGetComplaintOverview() // 测试
        this.requestGetPageview() // 测试
        this.requestGetTotalPublish() // 测试
        this.requestGetTotalItems() // 测试
        this.requestGetThirdPlatform() // 测试
      },
      // 设置请求参数
      setParam() {
        var obj = {
          areaCode: this.areaCode,
          areaLevel: this.areaLevel,
        }
        if (this.dateRange.length > 0) {
          obj.beginDate = this.dateRange[0]
          obj.endDate = this.dateRange[1]
        }
        return obj
      },
      // 设置请求参数无时间
      setParamDate() {
        var obj = {}
        if (this.dateRange.length > 0) {
          obj.beginDate = this.dateRange[0]
          obj.endDate = this.dateRange[1]
        }
        return obj
      },
      // 设置请求参数无时间
      setParamNoDate() {
        var obj = {
          areaCode: this.areaCode,
          areaLevel: this.areaLevel,
        }
        return obj
      },
      // 测试
      requestGetSumComplaint() {
        var param = this.setParam()
        this.amounts = this._mathRandom1000()
      },
      // 测试
      requestGetSumPvNumber() {
        var param = this.setParamDate()
        this.todayPvNumber = []
        for (let i = 0; i < 7; i++) {
          this.todayPvNumber.push({
            "visitDate": "2022-03-03",
            "pv": this._mathRandom1000()
          })
        }
        this.todayPvNumber = this.todayPvNumber.sort(this.compareTime('visitDate'))
      },
      // 时间比较
      compareTime(prop, align) {
        return function(a, b) {
          var val1 = a[prop]
          var val2 = b[prop]
          if (align) {
            return new Date(val2) - new Date(val1)
          }
          return new Date(val1) - new Date(val2)
        }
      },
      // 测试
      requestGetComplainStatistic() {
        var param = this.setParam()
        this.dayStaCount = []
        for (let i = 0; i < 7; i++) {
          this.dayStaCount.push({
            "ybj": this._mathRandom1000(),
            "amounts": this._mathRandom1000(),
            "zbl": this._mathRandom1000(),
            "dsl": this._mathRandom1000(),
            "comdate": "2022-03-04",
            "bysl": this._mathRandom1000()
          })
        }
        this.dayStaCount = this.dayStaCount.sort(this.compareTime('comdate'))
      },
      // 测试
      requestGetSatisfied() {
        var param = this.setParam()
        this.satisfied = {
          "verysatisfied": this._mathRandom1000(),
          "generalSatisfaction": this._mathRandom1000(),
          "amounts": this._mathRandom1000(),
          "veryDissatisfied": this._mathRandom1000(),
          "notVerySatisfied": this._mathRandom1000(),
          "satisfaction": this._mathRandom1000()
        }
      },
      // 测试
      requestGetTimedComplain() {
        this.timedComplain = []
        for (let i = 0; i < 10; i++) {
          this.timedComplain.push({
            "comUser": "匿名用户" + i,
            "comContact": (Math.random() * 100000000000).toFixed(0) * 1,
            "comDate": new Date(),
          })
        }
      },
      // 测试
      requestGetDaTjInformation() {
        var param = this.setParam()
        this.daTjInformation = []
        for (let i = 1; i < 6; i++) {
          this.daTjInformation.push({
            "pub_sub_type": i,
            "publishView": this._mathRandom1000()
          })
        }
      },
      // 测试
      requestGetComplaintOverview() {
        var param = this.setParamNoDate()
        this.complaintOverview = {
          "ypjamount": this._mathRandom1000(),
          "ypjmy": this._mathRandom1000(),
          "amounts": this._mathRandom1000(),
          "ybjlastweek": this._mathRandom1000(),
          "ybjtoday": this._mathRandom1000(),
          "ybjamounts": this._mathRandom1000(),
          "ybjyesterday": this._mathRandom1000()
        }
      },
      // 测试
      requestGetPageview() {
        var param = this.setParamNoDate()
        this.pageview = {
          "total": this._mathRandom1000(),
          "lastweekpv": this._mathRandom1000(),
          "beforeyesterdaypv": this._mathRandom1000(),
          "yesterdaypv": this._mathRandom1000()
        }
      },
      // 测试
      requestGetTotalPublish() {
        var param = this.setParamNoDate()
        this.totalPublish = this._mathRandom1000()
      },
      // 测试
      requestGetTotalItems() {
        var param = this.setParamNoDate()
        this.totalItems = this._mathRandom1000()
      },
      // 测试
      requestGetThirdPlatform() {
        this.thirdPlatform = this._mathRandom1000()
      },
    }
  };
</script>

<style scoped lang="scss">
  .root-height {
    height: 100vh;
  }

  .bgc-img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    // height: auto;
    height: 100%;
    background-image: url(../assets/img/bgcImg.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 40px 30px;
    // box-sizing: border-box;
  }

  .dataDescription {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .dataDes-item {
    width: 400px;
    height: 130px;
    background: linear-gradient(273deg, #055a88 0%, rgba(5, 89, 135, 0) 100%);
    border-radius: 10px 10px 10px 10px;
    display: flex;
    align-items: center;
  }

  .dataDes-item-img {
    width: 92px;
    height: 92px;
    margin-left: 70px;
    background-image: url(../assets/img/e-icon1.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .other1 {
    background-image: url(../assets/img/e-icon2.png);
  }

  .other2 {
    background-image: url(../assets/img/e-icon3.png);
  }

  .other3 {
    background-image: url(../assets/img/e-icon4.png);
  }

  .dataDes-item-des {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 10px;
  }

  .dataDes-item-des-font1 {
    font-size: 14px;
  }

  .dataDes-item-des-font2 {
    font-size: 30px;
    margin-top: 10px;
  }

  .dataInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }

  .dataInfo1 {
    display: flex;
    align-items: center;
    width: 400px;
    height: 240px;
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #09548D;
    background-color: #052741;
  }

  .dataInfo1-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dataInfo1-item1 {
    margin-left: 46px;
    margin-right: 98px;
  }

  .info1-item-img1 {
    width: 84px;
    height: 84px;
    background-image: url(../assets/img/e-icon5.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .info1-item-img2 {
    width: 84px;
    height: 84px;
    background-image: url(../assets/img/e-icon6.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .info1-item-font1 {
    font-size: 14px;
    margin-top: 19px;
    margin-bottom: 3px;
  }

  .info1-item-font2 {
    font-size: 30px;
  }

  .dataInfo2 {
    width: 672px;
    height: 240px;
    background: linear-gradient(90deg, #052741 0%, rgba(5, 39, 65, 0.44) 66%, rgba(5, 39, 65, 0) 100%);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #09548D;
  }

  .dataInfo2-title {
    width: 285px;
    height: 40px;
    background: linear-gradient(95deg, #0F324F 0%, #05253E 100%);
    position: relative;
    margin-left: 14px;
    margin-top: 20px;
    margin-bottom: 26px;
    padding-left: 15px;
    box-sizing: border-box;
    font-size: 18px;
    color: #fff;
    line-height: 40px;
  }

  .dataInfo2-title::before {
    content: '';
    width: 6px;
    height: 16px;
    background-image: url(../assets/img/listH.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    filter: drop-shadow(0px 0px 4px 1px rgba(255, 255, 255, 1));
  }

  .dataInfo2-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 50px 0 34px;
  }

  .info2-item {
    display: flex;
    align-items: flex-end;
  }

  .info2-item-img {
    width: 66px;
    height: 120px;
    background-image: url(../assets/img/e-icon7.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-right: 33px;
  }

  .info2-item-img1 {
    background-image: url(../assets/img/e-icon8.png);
  }

  .info2-item-img2 {
    background-image: url(../assets/img/e-icon9.png);
  }

  .info2-item-info {
    color: #03A7FE;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .item-info-font1 {
    font-size: 30px;
  }

  .item-info-font2 {
    font-size: 14px;
  }

  .dataInfo3 {
    width: 548px;
    height: 240px;
    background: linear-gradient(90deg, #052741 0%, rgba(5, 39, 65, 0.44) 66%, rgba(5, 39, 65, 0) 100%);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #09548D;
    padding: 20px 14px 21px 15px;
    box-sizing: border-box;
  }

  .dataInfo3-list {
    margin-top: 10px;
    padding: 0 26px 0 17px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    // width: 519px;
    height: 40px;
    background: linear-gradient(87deg, #0F2F56 0%, #05223B 100%);
  }

  .dataInfo3-list:first-child {
    margin-top: 19px;
  }

  .list-item-index {
    font-size: 16px;
    color: #03A7FE;
  }

  .list-item-content {
    font-size: 14px;
    color: #FFFFFF;
    margin-left: 16px;
  }

  .dataInfo3-list-befor {
    display: flex;
    align-items: center;
  }

  .dataInfo3-list-after {
    font-size: 16px;
    color: #03A7FE;
  }

  .dataEcharts {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
  }

  .discountE {
    width: 841px;
    height: 410px;
    background: linear-gradient(90deg, #052741 0%, rgba(5, 39, 65, 0.44) 66%, rgba(5, 39, 65, 0) 100%);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #09548D;
    padding-top: 14px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .discountE-left {
    flex: 1;
  }


  .discountE-left  div {
    width: 100% !important;
    height: 100% !important;
  }

  .discountE-left div  canvas{
    width: 100% !important;
    height: 100% !important;
  }



  .mapE {
    width: 841px;
    height: 410px;
    background: linear-gradient(90deg, #052741 0%, rgba(5, 39, 65, 0.44) 66%, rgba(5, 39, 65, 0) 100%);
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #09548D;
    padding-top: 21px;
    box-sizing: border-box;
  }

  .mapEdes {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #03A7FE;
  }

  .mapEdes-item {
    width: 110px;
    height: 37px;
    box-shadow: 0px 4px 16px 0px rgba(80, 106, 255, 0.08);
    border: 1px solid #00486F;
    text-align: center;
    line-height: 37px;
  }

  .mapDes-margin {
    margin: 0 21px 0 23px;
  }
</style>
