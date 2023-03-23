<template>
  <div class="Echarts">
    <div id="main" class="char"></div>
  </div>
</template>

<script>
import resize from "@/utils/resize";
export default {
  props: {
    costs: {
      type: Array,
      default: [],
    },
  },
  mixins: [resize],
  name: "Echarts",
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.initEcharts();
    });
    this.myEcharts();
  },

  methods: {
    initEcharts() {
      this.chart = this.$echarts.init(document.getElementById("main"));
    },
    myEcharts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById("main"));
      // 指定图表的配置项和数据
      var option = {
          grid: {
          top: '10%',
          left: '20%',//原来是10%，修改为20%
          right: '10%',
          bottom: '20%',
        },
        xAxis: {
          type: "category",
          nameTextStyle: {
            color: "##919193",
          },
          axisLabel: {
            margin: 31,
            textStyle: {
              fontSize: "14",
              color: "#919193",
            },
          },
          data: [
            // "10/1",
            // "10/2",
            // "10/3",
            // "10/4",
            // "10/5",
            // "10/6",
            // "10/7",
            // "10/8",
            // "10/9",
          ],
        },
        tooltip: {
                    show: true,
                    // 设定为按坐标轴触发
                    trigger: 'axis',
                  },
        yAxis: {
          // min: 0,
          // max: 3000,
          // interval: 500,
          type: "value",
          splitLine: {
            show: false, // 不显示网格线
          },
          axisLabel: {
            margin: 21,
            textStyle: {
              fontSize: "14",
              color: "#919193",
            },
          },
        },
        lineStyle: {
          color: "#5470c6",
        },
        series: [
          {
            data: [],
            type: "line",
            smooth: 0.5, // 设置折线弧度
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 1,
                      color: "rgba(8,161,254,0.11)",
                    },
                    {
                      offset: 0,
                      color: "rgba(5,35,59,0.13)",
                    },
                  ],
                },
              },
            },

            itemStyle: {
              normal: {
                color: "##74C4FE",
                lineStyle: {
                  color: "#1795da",
                },
              },
            },
          },
        ],
      };
      let aaa = [];
      aaa = this._props.costs;
      aaa.forEach((item) => {
        let a = item.date.indexOf("-");
        let q = item.date.slice(a + 1, item.date.length);
        option.xAxis.data.push(q);
        option.series[0].data.push(item.money);
      });
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.Echarts {
  width: 100%;
  height: 100%;
}
.char {
  width: 100%;
  height: 100%;
}
</style>