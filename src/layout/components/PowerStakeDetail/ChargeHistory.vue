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
			<el-form-item label="充电日期">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="loading" :data="tableData" border>
			<el-table-column fixed prop="orderNo" align="center" label="订单号">
				<template slot-scope="scope">
					<el-link type="primary" @click="handleOrderDetail(scope.row)"> {{scope.row.orderNo}}</el-link>
				</template>
			</el-table-column>
			<el-table-column fixed prop="status" align="center" label="订单状态" width="100">
				<template slot-scope="scope">
					{{scope.row.status|statusFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="startTime" align="center" label="开始时间">
			</el-table-column>
			<el-table-column prop="endTime" align="center" label="结束时间">
			</el-table-column>
			<el-table-column prop="endReason" align="center" label="结束原因">
				<template slot-scope="scope">
					{{scope.row.endReason}}
				</template>
				<!-- <template slot-scope="scope">
					{{scope.row.endReason|reasonFilter}}
				</template> -->
			</el-table-column>
			<el-table-column prop="totalCharge" align="center" label="充电总电量（度）">
			</el-table-column>
			<el-table-column prop="totalElectricMoney" align="center" label="充电费总金额" width="100">
				<template slot-scope="scope">
					￥{{scope.row.totalElectricMoney}}
				</template>
			</el-table-column>
			<el-table-column prop="totalServiceMoney" align="center" label="服务费总金额" width="100">
				<template slot-scope="scope">
					￥{{scope.row.totalServiceMoney}}
				</template>
			</el-table-column>
			<el-table-column prop="totalMoney" align="center" label="合计金额" width="100">
				<template slot-scope="scope">
					￥{{scope.row.totalMoney}}
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
			@pagination="getList" />
		<!-- </div> -->

		<!-- 订单详情 -->
		<orderDetail ref="orderDetailRef" />
	</el-dialog>
</template>


<script>
	import http from "@/utils/request";
	export default {
		components: {
			//引入组件
			orderDetail: () => import('@/layout/components/OrderDetail')
		},
		name: "ChargeHistory",
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
				total: 0,
				loading: false,
				title: "历史充电记录",
				dialogShow: false,
				queryParams: {
					page: 1,
					pageSize: 10,
					nodeId: undefined,
					orderBy: "startTime",
					isAsc: "desc",
				},
				dateRange: [],
				tableData: [],
			}
		},
		filters: {
			statusFilter(value) {
				let data = '';
				switch (value) {
					case 0:
						data = '充电就绪';
						break;
					case 1:
						data = '充电中';
						break;
					case 2:
						data = '已完成';
						break;
				}
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
						url: "/system/chargingPile/queryOrderByNode",
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
				this.title = "充电枪(" + name + ")历史充电记录";
				this.queryParams.nodeId = id;
				this.initPageList();
			},
			handleOrderDetail(row) {
				this.$refs.orderDetailRef.init(row.id);
			},
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

	// 		.text {
	// 			color: #606266;
	// 			font-size: 14px;
	// 		}
	// 	}
	// }
</style>
