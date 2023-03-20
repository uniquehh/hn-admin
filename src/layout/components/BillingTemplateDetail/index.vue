<template>

	<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="500px"
		append-to-body :close-on-press-escape="true" :close-on-click-modal="true">

		<el-form ref="form" label-width="80px">
			<el-row>
				<el-form-item label="模板名称">
					{{form.name}}
				</el-form-item>
			</el-row>

			<section>
				<div class="header line">设置时段</div>
				<el-col v-for="time,index in timeList" :key="index" :span="12" style="height: 25px;">
					<el-form-item :label="time.startTime+'~'+(time.endTime=='23:59'?'24:00':time.endTime)+'：'" label-width="100px">
						<!-- <el-radio-group v-model="time.type">
							<el-radio :label="0">尖时</el-radio>
							<el-radio :label="1">峰时</el-radio>
							<el-radio :label="2">平时</el-radio>
							<el-radio :label="3">谷时</el-radio>
						</el-radio-group> -->
						<el-tag v-if="time.timeIntervalType==0" type="danger">尖时</el-tag>
						<el-tag v-if="time.timeIntervalType==1" type="warning">峰时</el-tag>
						<el-tag v-if="time.timeIntervalType==2" type="success">平时</el-tag>
						<el-tag v-if="time.timeIntervalType==3" type="info">谷时</el-tag>
					</el-form-item>
				</el-col>
			</section>

			<el-table :data="form.priceList">
				<el-table-column prop="data" :label="'设置价格'">
					<template slot-scope="scope">
						<!-- <el-form-item :label="scope.row.data1"> -->
						<div class="line">
							<span style="font-weight: bold;width:auto;">
								{{scope.row.data1}}：
							</span>
							{{scope.row.price}}
						</div>
						<!-- </el-form-item> -->
					</template>
				</el-table-column>
				<el-table-column prop="data2">
					<template slot-scope="scope">
						<!-- <el-form-item :label="scope.row.data2"> -->
						<div class="line">
							<span style="font-weight: bold;width:auto;">
								{{scope.row.data2}}：
							</span>
							{{scope.row.serviceCharge}}
						</div>
						<!-- </el-form-item> -->
					</template>
				</el-table-column>
			</el-table>
		</el-form>

	</el-dialog>
</template>

<script>
	import request from "@/utils/request";
	export default {
		name: "BillingTemplateDetail",
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
				title: "查看计费模板详情",
				dialogShow: false,
				form: {
					priceList: [{
							data1: "尖时电价",
							price: 0,
							serviceCharge: 0,
							data2: "尖时服务费",
						},
						{
							data1: "峰时电价",
							price: 0,
							serviceCharge: 0,
							data2: "峰时服务费",
						},
						{
							data1: "平时电价",
							price: 0,
							serviceCharge: 0,
							data2: "平时服务费",
						},
						{
							data1: "谷时电价",
							price: 0,
							serviceCharge: 0,
							data2: "谷时服务费",
						},
					],
				},
				timeList: [],
			};
		},
		methods: {
			rowstyle({
				row,
				rowIndwx
			}) {
				let styleJson = {
					"height": "20px"
				};
				return styleJson
			},
			initDetail() {
				request({
					url: '/system/chargeTemplate/queryById/' + this.id,
					method: 'get'
				}).then(response => {
					this.title = "查看计费模板(" + response.data.name + ")详情";
					setTimeout(() => {
						this.dialogShow = true;
					}, 100);
								
					let priceList = this.form.priceList
					this.form = response.data;
					this.timeList = this.form.times
					priceList[0].price = this.form.tipPrice;
					priceList[0].serviceCharge = this.form.tipServiceCharge;
					priceList[1].price = this.form.peakPrice;
					priceList[1].serviceCharge = this.form.peakServiceCharge;
					priceList[2].price = this.form.flatPrice;
					priceList[2].serviceCharge = this.form.flatServiceCharge;
					priceList[3].price = this.form.valleyPrice;
					priceList[3].serviceCharge = this.form.valleyServiceCharge;
					this.form.priceList = priceList
				})
			},
			closeDialog() {
				this.dialogShow = false;
				// 向外部传递变量
				// this.$emit('dialogShowChange', false)
			},
			clear() {
				this.id = null;
			},
			init(id) {
				this.id = id;
				this.initDetail();
			}
		},
	};
</script>

<style scoped>
	.line {
		line-height: 20px;
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
	}

	.line span {
		display: inline-block;
	}
</style>
