<template>
  <div class="app-container">
    <el-form
      size="small"
      ref="form"
      :inline="true"
      :model="queryParams"
      :rules="rules"
      label-width="100px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="关键字:">
            <el-input
              placeholder="请输入电站名称"
              clearable
              v-model="queryParams.stationName"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="统计日期:">
            <el-date-picker
              v-model="date"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="投放项目:" prop="menuName">
            <el-select
              v-model="queryParams.projectId"
              clearable
              placeholder="请选择站点投放项目"
            >
              <el-option
                v-for="item in projectArr"
                :key="item.id"
                :label="item.projectName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="投放道路:" prop="menuName">
            <el-select
              v-model="queryParams.roadId"
              clearable
              placeholder="请选择充电站投放道路"
            >
              <el-option
                v-for="item in roadArr"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>

    <div
      style="
        width: 90%;
        height: 30%;
        margin-left: 30px;
        border-radius: 10px;
        border: 1px solid #ccc;
      "
    >
      <div class="Echarts">
        <div
          id="main"
          style="width: 900px; height: 400px; margin: 0 auto"
        ></div>
      </div>
    </div>

    <div
      style="
        width: 90%;
        height: 30%;
        margin-left: 30px;
        margin-top: 20px;
        padding-top: 30px;
        padding-left: 30px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid #ccc;
      "
    >
      <div class="Echarts">
        <div
          id="bing"
          style="width: 900px; height: 400px; margin: 0 auto"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "ChargingData",
  data() {
    return {
      projectArr: [],

      roadArr: [],

      date: "",

      // 查询参数
      queryParams: {
        endDate: this.getNow(),
        projectId: "",
        roadId: "",
        startDate: this.getFirst(),
        stationName: "",
      },
      detail: {
        time: [],
        degree: [],
        date: [],
      },

      rules: {
        date: [
          {
            required: true,
            message: "请选择统计日期",
            trigger: "change",
          },
        ],
      },
    };
  },

  async created() {
    await this.getData();
    this.myEcharts();
    this.myEchartsT();
    this.getProject();
    this.getRoad();
  },

  methods: {
    getData() {
      return request({
        url: "system/statistics/queryCharging",
        method: "post",
        data: this.queryParams,
      }).then((res) => {
        (this.detail.date = res.data.map((item) => {
          return item.date;
        })),
          (this.detail.degree = res.data.map((item) => {
            return item.valley;
          }));
        this.detail.time = res.data.map((item) => {
          return item.hour;
        });
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    getProject() {
      return request({
        url: "/system/project/getAll",
        method: "get",
      }).then((res) => {
        this.projectArr = res.data;
      });
    },

    getRoad() {
      return request({
        url: "/system/road/getAll",
        method: "get",
      }).then((res) => {
        this.roadArr = res.data;
      });
    },

    async handleQuery() {
      console.log(this.date, "dddddddddd");
      if (this.date) {
        this.queryParams.startDate = this.date[0];
        this.queryParams.endDate = this.date[1];
      }

      console.log(this.queryParams, "11111111");

      await this.getData();
      this.myEcharts();
      this.myEchartsT();
    },
    resetQuery() {
      this.queryParams = {
        endDate: this.getNow(),
        projectId: "",
        roadId: "",
        startDate: this.getFirst(),
        stationName: "",
      };
      this.date = "";
      this.handleQuery();
    },

    //时长(小时)走势
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
        title: {
          x: "left",
          text: "充电时长走势（小时）",
        },
        xAxis: {
          type: "category",
          nameTextStyle: {
            color: "#81838a",
          },
          data: this.detail.date,
        },
         tooltip: {
                    show: true,
                    // 设定为按坐标轴触发
                    trigger: 'axis',
                  },
        yAxis: {
          type: "value",
          axisLine: { show: false },
        },
        lineStyle: {
          color: "#5470c6",
        },
        series: [
          {
            data: this.detail.time,
            type: "line",
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },

    //度数走势
    myEchartsT() {
      // 基于准备好的dom，初始化echarts实例
      var myChartT = this.$echarts.init(document.getElementById("bing"));
      // 指定图表的配置项和数据
      var optionT = {
        title: {
          x: "left",
          text: "充电度数走势（度）",
        },

        //日期
        xAxis: {
          type: "category",
          nameTextStyle: {
            color: "#81838a",
          },
          data: this.detail.date,
        },
         tooltip: {
                    show: true,
                    // 设定为按坐标轴触发
                    trigger: 'axis',
                  },
        yAxis: {
          type: "value",
          axisLine: { show: false },
        },
        lineStyle: {
          color: "#5470c6",
        },
        series: [
          {
            data: this.detail.degree,
            type: "line",
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChartT.setOption(optionT);
    },

    getFirst() {
      var date = new Date();
      date.setDate(1);
      var cTime = new Date(new Date(date).toLocaleDateString()).getTime();
      //将时间戳转换成时间格式
      var date1 = new Date(cTime);
      var year = date1.getFullYear();
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      var ddate = year + "-" + month + "-" + day;
      return ddate;
    },

    getNow() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      var ddate = year + "-" + month + "-" + day;
      return ddate;
    },
  },
  mounted() {},
};
</script>

<style scoped></style>
