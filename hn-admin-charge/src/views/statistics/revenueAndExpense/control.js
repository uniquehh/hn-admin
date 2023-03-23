import { getProjectAll, getRoadAll, updataListOneInfo } from "@/api/rae/revenueExpense";
import { options } from "runjs";
export default {
    name: "RevenueAndExpense",
    data() {
        return {
            // 项目
            options: [

            ],
            // 道路
            options2: [

            ],

            dateArr: '',

            form: {},

            queryParmas: {
                endDate: '',
                projectId: null,
                roadId: null,
                startDate: '',
                stationName: ''
            },

            value2: '',
            qqq: false,
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
    mounted() {
        this.getSomeData();
        this.getEchartsOptions()
    },
    methods: {

        // 获取项目
        getSomeData() {
            getProjectAll().then(res => {
                this.options = res.data
            })
            getRoadAll().then(res => {
                this.options2 = res.data
            })
        },

        // 获取数据
        getEchartsOptions() {
            this.searchE()
        },

        // 搜索按钮
        searchE() {
            if (this.isEmpty(this.dateArr)) {
                let da = new Date()
                let y = da.getFullYear()
                let m = this.autoZore(da.getMonth() + 1)
                let d = this.autoZore(da.getDate())
                console.log(y, m, d, '[][][]====')
                let mfirstD = y + '-' + m + '-' + '01'
                let today = y + '-' + m + '-' + d
                this.queryParmas.startDate = mfirstD
                this.queryParmas.endDate = today
            } else {
                this.queryParmas.startDate = this.dateArr[0]
                this.queryParmas.endDate = this.dateArr[1]
            }
            console.log(this.queryParmas, '[][]')
            updataListOneInfo(this.queryParmas).then(res => {
                console.log(res, '[]获取的结果')
                this.myEcharts(res.data.costs)
                this.myEchartsT(res.data.deviceMoney)
            })
        },

        /** 重置按钮操作 */
        resetQuery() {
            this.queryParmas = {
                endDate: '',
                projectId: null,
                roadId: null,
                startDate: '',
                stationName: ''
            }
            this.dateArr = []
            this.searchE()
        },

        isEmpty(str) {
            if (str == "" || str == null || str == undefined || JSON.stringify(str) == "[]" || JSON.stringify(str) == "{}") {
                return true;
            } else {
                return false;
            }
        },

        autoZore(num) {
            if (num < 10) {
                return "0" + num.toString();
            } else {
                return num.toString();
            }
        },


        myEcharts(pars) {
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.$echarts.init(document.getElementById("main"));
            // 指定图表的配置项和数据
            var option = {
                title: {
                    x: "left",
                    text: "充电费用(元)走势",
                },
                xAxis: {
                    type: "category",
                    nameTextStyle: {
                        color: "#81838a",
                    },
                    data: [],
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
                        data: [],
                        type: "line",
                    },
                ],
            };
            let q = {
                date: [],
                money: []
            }
            pars.forEach((item) => {
                q.date.push(item.date)
                q.money.push(item.money)
            })
            console.log(q)
            option.xAxis.data = q.date
            option.series[0].data = q.money

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        //params 要处理的字符串
        //length 每行显示长度
        getEqualNewlineString(params, length) {
            let text = ''
            let count = Math.ceil(params.length / length) // 向上取整数
            // 一行展示length个
            if (count > 1) {
                for (let z = 1; z <= count; z++) {
                    text += params.substr((z - 1) * length, length)
                    if (z < count) {
                        text += '\n'
                    }
                }
            } else {
                text += params.substr(0, length)
            }
            return text
        },

        myEchartsT(pars) {
            // 基于准备好的dom，初始化echarts实例
            var myChartT = this.$echarts.init(document.getElementById("bing"));
            // 指定图表的配置项和数据
            var optionT = {
                title: {
                    text: "设备电费分布",
                    left: "center",
                },
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    // left: 80,
                    top: 40,
                    formatter: (name) => {
                        if (!name) return ''
                        return this.getEqualNewlineString(name, 10) // 根据你的需求修改参数
                    }
                },
                series: [
                    {
                        name: "电费分布",
                        avoidLabelOverlap: true,
                        minAngle: 20,
                        type: "pie",
                        radius: "70%",
                        data: [],

                        textStyle: {
                            fontSize: 10
                        },
                        formatter: (params) => {
                            //调用自定义显示格式
                            return this.getEqualNewlineString(params.name, 10);
                        },
                        emphasis: {
                            show: true,
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)",
                            },
                        },
                    },
                ],
            };
            pars.forEach((item) => {
                if (item.money == 0) {
                    item.money = ''
                }
                optionT.series[0].data.push({ value: item.money, name: item.name })
            })
            // 使用刚指定的配置项和数据显示图表。
            myChartT.setOption(optionT);
        },
    },

};