<template>
	<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
		@closed="clear" append-to-body :close-on-press-escape="true" :close-on-click-modal="true"
		:destroy-on-close="true">
		<div class="line header">订单基础信息</div>

		<div class="line">
			<span>
				<span class="order-title-index-qj">订单状态：</span>

				<el-tag v-if="detail.status==0" type="danger">充电就绪</el-tag>
				<el-tag v-else-if="detail.status==1" type="success">充电中</el-tag>
				<el-tag v-else-if="detail.status==2" type="info">已完成</el-tag>
			</span>
			<span><span class="order-title-index-qj">订单号：</span>{{detail.orderNo}}</span>
		</div>

		<div class="line">
			<span><span class="order-title-index-qj">订单总额(元)：</span>{{detail.totalMoney}}</span>
			<span><span class="order-title-index-qj">充电总量(度)：</span>{{detail.totalCharge||0}}</span>
		</div>

		<div class="line">
			<span><span class="order-title-index-qj">电费金额(元)：</span>{{detail.totalElectricMoney}}</span>
			<span><span class="order-title-index-qj">服务费金额(元)：</span> {{detail.totalServiceMoney||0}}</span>
		</div>
		<div class="line">
			<span> <span class="order-title-index-qj">开始充电时间：</span>{{detail.startTime}} </span>
			<span> <span class="order-title-index-qj">充电时长：</span>{{formatSeconds(detail.chargeSeconds)}} </span>
		</div>



		<div class="line header">充电司机信息</div>
		<div class="line">
			<span><span class="order-title-index-qj">司机姓名：</span>{{detail.driverName}}</span>
			<span><span class="order-title-index-qj"> 司机电话：</span>{{detail.driverPhone}}</span>
		</div>

		<div class="line">
			<span><span class="order-title-index-qj">订单所属项目：</span>{{detail.projectName}}</span>
			<span><span class="order-title-index-qj"> 车辆设备编码：</span>{{detail.carCode||''}}</span>
		</div>

		<div class="line">
			<span> <span class="order-title-index-qj">项目所属公司：</span>{{detail.enterpriseName}}</span>
			<span><span class="order-title-index-qj">项目所同道路：</span>{{detail.roadName}}</span>
		</div>

		<div class="line header">充电站信息</div>
		<div class="line">
			<span><span class="order-title-index-qj">电站名称：</span>{{detail.chargingStationName}}</span>
			<span><span
					class="order-title-index-qj">充电桩桩位号：</span>{{detail.chargingPileCode}}({{detail.chargingPileNodeName}})</span>
		</div>

		<div class="line">
			<span><span class="order-title-index-qj">终端唯一编码：</span>{{detail.chargingPileUnionCode}}</span>
		</div>
		<div v-if="detail.status==2 && detail.bookFlag!=1">
			<div class="line header"><span class="order-title-index-qj">充电订单结果明细：</span></div>

			<div class="line">
				<span v-if="detail.status==2"><span class="order-title-index-qj">结束充电时间：</span>{{detail.endTime}}</span>
				<span v-if="detail.status==1"><span class="order-title-index-qj">结束充电时间：</span>{{detail.endTime}}</span>
			</div>

			<div class="line"><span><span class="order-title-index-qj">结束原因：</span>{{detail.endReason}}</span></div>

			<div class="line">
				<span> <span class="order-title-index-qj">开始充电s0C(%)：</span> {{detail.startSoc||0}}</span>
				<span><span class="order-title-index-qj">结束充电SOC(%)：</span> {{detail.endSoc||0}} </span>
			</div>

			<div class="line"><span><span class="order-title-index-qj">充电总电量(度)：</span> {{detail.totalCharge||0}}</span>
			</div>

			<div class="line">
				<span> <span class="order-title-index-qj">尖时电量(度)：</span> {{detail.chargeTip||0}} </span>
				<span><span class="order-title-index-qj">峰时电量(度)：</span> {{detail.chargePeak||0}} </span>
			</div>

			<div class="line">
				<span> <span class="order-title-index-qj">平时电量(度)：</span>{{detail.chargeFlat||0}} </span>
				<span><span class="order-title-index-qj">谷时电量(度)：</span> {{detail.chargeValley||0}} </span>
			</div>
		</div>
		<!--  <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
    </div> -->
	</el-dialog>
</template>

<script>
	import http from '@/utils/request'
	export default {
		name: 'roadDetail',
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
				title: '查看订单详情',
				dialogShow: false,
				id: null,
				total: 0,
				loading: false,
				detail: {}
			}
		},
		methods: {
			initDetail() {
				this.detail = {};
				http.request({
					url: '/system/order/queryById/' + this.id,
					method: 'get'
				}).then(res => {
					this.detail = res.data;
					this.title = "查看订单(" + res.data.orderNo + ")详情"
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
			},
			init(id) {
				this.id = id;
				this.initDetail();
			}
		}
	}
</script>


<style type="text/css" scoped>
	.line {
		line-height: 40px;
		padding: 0rpx 50px;
		padding-left: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.line~.line {
		border-bottom: 1px solid #eee;
	}

	.header {
		background-color: #f3f3f3;
		line-height: 40px;
		font-weight: bold;
		margin: 0px -20px;
		padding: 0px 20px;
	}

	.line span {
		display: inline-block;
		width: unset !important;
		flex: 1;
	}

	.order-title-index-qj {
		font-weight: bold !important;
	}
</style>
