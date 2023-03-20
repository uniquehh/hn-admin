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
			<el-form-item label="类型" prop="type">
				<el-select v-model="queryParams.type" clearable placeholder="请选择类型" style="width:110px">
					<el-option label="后台充值" :value="0" />
					<el-option label="后台扣除" :value="1" />
					<el-option label="充电抵扣" :value="2" />
				</el-select>
			</el-form-item>
			<el-form-item label="日期">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
			</el-form-item>
		</el-form>

		<el-table v-loading="loading" :data="tableData" border>
			<el-table-column fixed prop="type" align="center" label="类型" width="100">
				<template slot-scope="scope">
					{{scope.row.type|typeFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="changeMoney" align="center" label="金额">
			</el-table-column>
			<el-table-column prop="orderNo" align="center" label="订单号">
				<template slot-scope="scope">
					<el-link v-if="scope.row.type==2" type="primary" @click="handleOrderDetail(scope.row)">
						{{scope.row.orderNo}}
					</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="userName" align="center" label="操作人">
				<template slot-scope="scope">
					<span v-if="scope.row.type!=2">{{scope.row.userName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="凭证">
				<template slot-scope="scope">
					<ImagePreview v-if="scope.row.type!=2&&scope.row.images" :src="scope.row.images?scope.row.images:''"
						width="80px" />
				</template>
			</el-table-column>
			<el-table-column prop="remark" align="center" label="备注" width="200" :show-overflow-tooltip="true">
			</el-table-column>
			<el-table-column prop="createTime" align="center" label="时间">
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
		name: "constructionMoneyLog",
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
				title: "余额记录",
				dialogShow: false,
				queryParams: {
					page: 1,
					pageSize: 10,
					constructionEnterpriseId: undefined,
					orderBy: "t.createTime",
					isAsc: "desc",
				},
				dateRange: [],
				tableData: [],
			}
		},
		filters: {
			typeFilter(value) {
				let data = '';
				switch (value) {
					case 0:
						data = '后台充值';
						break;
					case 1:
						data = '后台扣除';
						break;
					case 2:
						data = '充电抵扣';
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
						url: "/system/constructionEnterprise/queryMoneyLogList",
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
				this.title = "施工单位(" + name + ")余额记录";
				this.queryParams.constructionEnterpriseId = id;
				this.initPageList();
			},
			handleOrderDetail(row) {
				this.$refs.orderDetailRef.init(row.relationId);
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
