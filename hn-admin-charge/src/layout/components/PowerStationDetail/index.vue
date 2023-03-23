<template>

	<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
		append-to-body :close-on-press-escape="true" :close-on-click-modal="true">
		<div class="header">电站基础信息</div>

		<el-form :inline="true" label-width="100px" size="mini">
			<el-row>
				<el-col :span="12">
					<el-form-item label="缩略图：">
						<ImagePreview :width="100" :src="detail.coverImg?detail.coverImg:''" />
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="位置示意图：">
						<ImagePreview :width="100" :src="detail.positionImg?detail.positionImg:''" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="投放项目：">
						{{detail.projectName}}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="投放道路：">
						{{detail.roadName}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="行政区域：">
						{{detail.province}}-{{detail.city}}-{{detail.district}}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="具体地址：">
						{{detail.address}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="状态：">
						<el-tag v-if="detail.status==0" type="success">启用</el-tag>
						<el-tag v-if="detail.status==1" type="danger">禁用</el-tag>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="充电桩数量：">
						{{detail.pileAmount}}
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12">
					<el-form-item label="创建日期：">
						{{detail.createTime}}
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="计费模板：">
						{{detail.chargeTemplateName}}
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>


		<div class="header">运营数据</div>

		<el-form :inline="true" label-width="110px" size="mini">
			<el-row>
				<el-col :span="8">
					<el-form-item label="累计服务次数：">
						{{detail.serviceTimes}}
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="累计充电量度数：">
						{{detail.chargingCapacity}}度
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="累计充电量金额：">
						￥{{detail.chargingPrice}}
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div class="header">充电桩列表</div>

		<el-table v-loading="loading" :data="tableData" border style="width: auto">
			<el-table-column prop="unionCode" label="电桩编码" align="center">
				<template slot-scope="scope">
					<el-link type="primary" @click="handleStakeView(scope.row)">
						{{scope.row.unionCode}}
					</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="type" align="center" label="电桩类型">
				<template slot-scope="scope">
					{{scope.row.type|typeFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="code" align="center" label="桩位号">
			</el-table-column>
			<el-table-column prop="ratedPower" align="center" label="额定功率(KW)">
			</el-table-column>
			<el-table-column prop="chargeTemplateName" align="center" label="计费模板">
				<template slot-scope="scope">
					<el-link type="primary" @click="handleBillingTemplateView(scope.row)">
						{{scope.row.chargeTemplateName}}
					</el-link>
				</template>
			</el-table-column>
			<el-table-column prop="firstNodeStatus" align="center" label="A枪状态">
				<template slot-scope="scope">
					{{scope.row.firstNodeStatus|statusFilter}}
				</template>
			</el-table-column>
			<el-table-column prop="secondNodeStatus" align="center" label="B枪状态">
				<template slot-scope="scope">
					{{scope.row.secondNodeStatus|statusFilter}}
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
			@pagination="getList" :page-sizes="[5, 10, 20, 50, 100]" />

		<!-- 查看电桩 -->
		<PowerStakeDetail ref="PowerStakeDetailRef" />
		
		<!-- 查看模板详情 -->
		<BillingTemplateDetail ref="BillingTemplateDetailRef" />
	</el-dialog>
</template>

<script>
	import http from "@/utils/request";
	export default {
		name: "PowerStationDetail",
		components: {
			PowerStakeDetail: () => import('@/layout/components/PowerStakeDetail/index'),
			BillingTemplateDetail: () => import('@/layout/components/BillingTemplateDetail/index')
		},
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
				id: null,
				total: 0,
				loading: false,
				title: "查看电站详情",
				dialogShow: false,
				queryParams: {
					page: 1,
					pageSize: 5,
					stationId: undefined,
					orderBy: "t.createTime",
					isAsc: "desc",
				},
				tableData: [],
				detail: {},
			};
		},
		filters: {
			statusFilter(value) {
				let data = '';
				switch (value) {
					case -1:
						data = '未启用';
						break;
					case 0:
						data = '空闲';
						break;
					case 1:
						data = '已插枪未充电';
						break;
					case 2:
						data = '充电中';
						break;
					case 3:
						data = '充电结束未拔枪';
						break;
					case 4:
						data = '预约中';
						break;
					case 5:
						data = '故障';
						break;
					case 6:
						data = '离线';
						break;
				}
				return data;
			},
			typeFilter(value) {
				let data = '';
				switch (value) {
					case 1:
						data = '交流充电桩';
						break;
					case 2:
						data = '直流充电桩';
						break;
				}
				return data;
			},
		},
		methods: {
			getList() {
				this.loading = true;
				let that = this;
				http
					.request({
						url: "/system/chargingStation/queryPileList",
						method: "get",
						params: this.queryParams,
					})
					.then((res) => {
						that.tableData = res.rows || [];
						that.total = res.total;
						that.loading = false;
					})
					.catch(() => {
						this.loading = false;
					});
			},
			initDetail() {
				this.detail = {};
				http
					.request({
						url: "/system/chargingStation/queryById/" + this.id,
						method: "get",
					})
					.then((res) => {
						this.detail = res.data;
						this.title = "查看电站(" + res.data.name + ")详情";
						setTimeout(() => {
							this.dialogShow = true;
						}, 100);
					});
			},
			initPageList() {
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
				this.detail = {};
				this.id = null;
				this.tableData = [];
			},
			init(id) {
				this.id = id;
				this.queryParams.stationId = id;
				this.initDetail();
				this.initPageList();
			},
			handleStakeView(row) {
				this.$refs.PowerStakeDetailRef.init(row.id);
			},
			//模板详情
			handleBillingTemplateView(row) {
				this.$refs.BillingTemplateDetailRef.init(row.chargeTemplateId);
			},
		},
	};
</script>

<style scoped>
	.line {
		line-height: 40px;
		padding: 0rpx 50px;
		padding-left: 10px;
	}

	.line+.line {
		border-top: 1px solid #eee;
	}

	.header {
		background-color: #f3f3f3;
		line-height: 40px;
		font-weight: bold;
		margin: 0px -20px;
		padding: 0px 20px;
		margin-bottom: 20px;
	}

	.line span {
		display: inline-block;
		width: 50%;
	}
</style>
