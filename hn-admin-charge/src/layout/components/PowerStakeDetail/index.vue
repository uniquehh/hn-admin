<template>
	<div>
		<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
			append-to-body :close-on-press-escape="true" :close-on-click-modal="true">
			<div class="header">电站基础信息</div>

			<el-form :inline="true" label-width="100px" size="mini">
				<el-row>
					<el-form-item label="电桩编码：">
						{{detail.unionCode}}
					</el-form-item>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="桩位号：">
							{{detail.code}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="投放日期：">
							{{detail.releaseDate}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="生产日期：">
							{{detail.productionDate}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="服务截止日期：">
							{{detail.endDate}}
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="电桩类型：">
							{{detail.type|typeFilter}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="额定功率：">
							{{detail.ratedPower}}KW
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="所属电站：">
							{{detail.stationName}}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="计费模板：">
							{{detail.chargeTemplateName}}
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>


			<template v-for="(node,index) in detail.nodes">
				<div class="header">
					{{node.name}}运营数据
					<el-button size="mini" type="primary" @click="toChargeHistory(node)">查看历史充电记录</el-button>
					<el-button size="mini" type="primary" @click="toWaringHistory(node)">查看历史告警记录</el-button>
				</div>
				<el-form :inline="true" label-width="110px" size="mini">
					<el-row>
						<el-col :span="12">
							<el-form-item label="实时状态：">
								{{node.status|statusFilter}}
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="累计充电次数：">
								{{node.serviceTimes}}次
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<el-form-item label="累计充电度数：">
								{{node.chargingCapacity}}度
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="累计充电金额：">
								￥{{node.chargingPrice}}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</template>
		</el-dialog>

		<!-- 历史充电记录 -->
		<ChargeHistory ref="ChargeHistoryRef" />

		<!-- 历史告警记录 -->
		<WaringHistory ref="WaringHistoryRef" />
	</div>
</template>

<script>
	import http from "@/utils/request";
	export default {
		components: {
			ChargeHistory: () => import("@/layout/components/PowerStakeDetail/ChargeHistory"),
			WaringHistory: () => import("@/layout/components/PowerStakeDetail/WaringHistory"),
		},
		name: "PowerStakeDetail",
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
				title: "查看电桩详情",
				dialogShow: false,
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
			initDetail() {
				this.detail = {};
				http
					.request({
						url: "/system/chargingPile/queryById/" + this.id,
						method: "get",
					})
					.then((res) => {
						this.detail = res.data;
						this.title = "查看电桩(" + res.data.unionCode + ")详情";
						setTimeout(() => {
							this.dialogShow = true;
						}, 100);
					});
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
				this.initDetail();
			},
			toChargeHistory(node) {
				this.$refs.ChargeHistoryRef.init(node.nodeId, this.detail.unionCode +'0'+ node.num);
			},
			toWaringHistory(node) {
				this.$refs.WaringHistoryRef.init(node.nodeId, this.detail.unionCode +'0'+ node.num);
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
