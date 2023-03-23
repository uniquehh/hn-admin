<template>

	<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="60%"
		append-to-body :close-on-press-escape="true" :close-on-click-modal="true">

		<!-- <div class="cghistory"> -->
		<!-- 	<div class="head">
				<div class="text">充电日期：</div>
				<div class="time">
					<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
						range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</div>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="doSearch">搜索</el-button>
			</div> -->

		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
			<el-form-item label="故障日期">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="loading" :data="tableData" border>
			<el-table-column prop="warnStartTime" align="center" label="告警开始时间">
			</el-table-column>
			<el-table-column prop="warnEndTime" align="center" label="告警结束时间">
			</el-table-column>
			<el-table-column prop="warnCode" align="center" label="告警码">
				<template slot-scope="scope">
					{{scope.row.warnCode}}
				</template>
				<!-- <template slot-scope="scope">
					{{scope.row.endReason|reasonFilter}}
				</template> -->
			</el-table-column>
			<el-table-column prop="warnCode" align="center" label="告警码中文">
				<template slot-scope="scope">
					{{scope.row.warnCode|warnCodeFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="status" align="center" label="是否恢复">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status==1" type="danger">未恢复</el-tag>
					<el-tag v-if="scope.row.status==0" type="success">已恢复</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<div style="text-align:right;margin-top:20px;">平均恢复时长：<span class="text">{{hour}}小时</span></div>
		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
			@pagination="getList" />
		<!-- </div> -->
	</el-dialog>
</template>


<script>
	import http from "@/utils/request";
	export default {
		name: "WaringHistory",
		// 传入参数
		props: {
			// "dialogShow": {
			//   type: Boolean
			// },
			// "title": {
			//   type: String
			// }
		},
		data() {
			return {
				hour: 0,
				total: 0,
				loading: false,
				title: "历史故障记录",
				dialogShow: false,
				queryParams: {
					page: 1,
					pageSize: 10,
					nodeId: undefined,
					orderBy: "warnStartTime",
					isAsc: "desc",
				},
				dateRange: [],
				tableData: [],
			}
		},
		filters: {
			warnCodeFilter(code) {
				let warnCodeData = {
					'1001': '触摸屏故障',
					'1002': '读卡器故障',
					'1003': '打印机故障',
					'1004': '电表故障',
					'1005': '电表对时故障',
					'1006': '电表通讯故障',
					'1007': '维修门异常打开',
					'1008': '插座门故障',
					'1009': '防雷器故障',
					'1010': '风扇故障',
					'1011': '温度传感器故障',
					'1012': '充电枪故障',
					'1013': '桩体倾倒或严重振动',
					'1014': '连接确认异常',
					'1015': '输出继电器异常',
					'1016': '控制板异常',
					'1017': '采集板异常',
					'1018': '充电桩监控器异常',
					'1019': '熔断器故障',
					'1020': '充电桩电源模块异常',
					'1021': '直流接触器异常',
					'1022': '交流接触器异常',
					'1023': '电池锁异常',
					'1024': '低压辅源异常',
					'1025': '集中器异常',
					'1026': '设备绝缘异常',
					'2001': '设备停电',
					'2002': '备用电池电量低',
					'2003': '急停开关触发',
					'2004': '交流跳闸',
					'2005': '短路保护触发',
					'2006': '漏电保护触发',
					'2007': '温度异常',
					'3101': '交流输入异常',
					'3102': '交流输入缺相',
					'3103': '交流电压异常',
					'3104': '交流输入过压',
					'3105': '交流输入欠压',
					'3106': '交流输入频率过频',
					'3107': '交流输入频率欠频',
					'3108': '交流电流过负荷',
					'3171': 'A相电流过负荷',
					'3172': 'B相电流过负荷',
					'3173': 'C相电流过负荷',
					'3174': 'A相断相',
					'3175': 'B相断相',
					'3176': 'C相断相',
					'3177': 'A相电压过压',
					'3178': 'B相电压过压',
					'3179': 'C相电压过压',
					'3180': 'A相电压欠压',
					'3181': 'B相电压欠压',
					'3182': 'C相电压欠压',
					'3201': '直流输出异常',
					'3202': '直流输出过压',
					'3203': '直流输出欠压',
					'3204': '直流输出电流过流',
					'3205': '直流输出反接',
					'3206': '直流输出断路',
					'3207': '直流母线输入过压',
					'3208': '直流母线输入欠压',
					'4001': '车辆BMS通信异常',
					'4002': '车辆BMS反接',
					'4003': '车辆BMS终止',
					'4004': '车辆蓄电池充电过流',
					'4005': '车辆蓄电池模块过温',
					'4006': '车辆蓄电池连接异常',
					'4007': '车辆蓄电池电压采集异常',
					'4008': '车辆蓄电池电压过压',
					'5002': '迪文通信异常',
					'9999': '其他故障'
				};
				let data = warnCodeData[code];
				return data;
			}
		},
		methods: {
			handleQuery() {
				this.queryParams.page = 1;
				this.getList();
			},
			getList() {
				this.loading = true;
				const params = this.queryParams;
				if (this.dateRange && this.dateRange.length > 0) {
					params.startDate = this.dateRange[0];
					params.endDate = this.dateRange[1];
				} else {
					params.startDate = '';
					params.endDate = '';
				}
				let that = this;
				http
					.request({
						url: "/system/chargingPile/queryWarnLogByNode",
						method: "get",
						params: params,
					})
					.then((res) => {
						that.tableData = res.rows || [];
						that.total = res.total;
						that.loading = false;
						setTimeout(() => {
							this.dialogShow = true;
						}, 100);
					})
					.catch(() => {
						this.loading = false;
					});

				http
					.request({
						url: "/system/chargingPile/queryWarnAverageHour",
						method: "get",
						params: params,
					})
					.then((res) => {
						that.hour = res.data
					})
					.catch(() => {
						// this.loading = false;
					});
			},
			initPageList() {
				this.dateRange = '';
				this.queryParams.page = 1;
				this.total = 0;
				this.tableData = [];
				this.getList();
			},

			closeDialog() {
				this.dialogShow = false;
				// 向外部传递变量
				// this.$emit('dialogShowChange', false)
			},
			clear() {
				this.id = null;
				this.tableData = [];
			},
			init(id, name) {
				this.title = "充电枪(" + name + ")历史故障记录";
				this.queryParams.nodeId = id;
				this.initPageList();
			}
		},
	};
</script>

<style scoped lang="scss">
	// .cghistory {
	// 	.head {
	// 		margin-bottom: 20px;
	// 		display: flex;
	// 		align-items: center;

	// 		.el-range-editor--medium.el-input__inner {
	// 			height: 30px;
	// 			display: flex;
	// 			align-items: center;
	// 		}

	// 		::v-deep .el-range-editor--medium .el-range-separator {
	// 			height: unset;
	// 			line-height: unset;
	// 		}

	// 		::v-deep .el-range-editor--medium .el-range__icon,
	// 		.el-range-editor--medium .el-range__close-icon {
	// 			height: unset;
	// 			line-height: unset;
	// 		}

	// 		.time {
	// 			margin-right: 20px;
	// 		}

	.text {
		color: #d9001b !important;
		font-size: 14px;
	}

	// 	}
	// }
</style>
