<template>
	<el-dialog :title="title" style="min-width:500px" width="50%" :visible.sync="detailShow" append-to-body>
		<div class="line header">施工单位基础信息</div>

		<div class="line">
			<h5>单位名称：</h5>{{ detail.name }}
		</div>

		<div class="line">
			<h5>所属项目：</h5>{{ detail.projectName }}
		</div>

		<div class="line">
			<span>
				<h5>联系人：</h5>{{ detail.contactName }}
			</span>
			<span>
				<h5>联系电话：</h5>{{ detail.contactPhone }}
			</span>
		</div>

		<div class="line">
			<span>
				<h5>联系地址：</h5>{{ detail.contactAddress }}
			</span>
		</div>

		<div class="line">
			<span>
				<h5>备注：</h5>{{detail.remark}}
			</span>
		</div>

		<div class="line header">运营数据</div>

		<div class="line">		
			<span>
				<h5>余额：</h5>{{detail.money}}元
			</span>
			<span>
				<h5>设备数量：</h5>{{detail.deviceAmount}}
			</span>
		</div>

		<div class="line">
			<span>
				<h5>累计充电量：</h5>{{detail.chargingCapacity}}度
			</span>
			<span>
				<h5>累计充电金额：</h5>{{detail.chargingPrice}}元
			</span>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="detailShow = false">关闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		data() {
			return {
				detailShow: false,
				title: '',
				detail: {
					chargingCapacity: 0,
					chargingPrice: 0,
					contactAddress: "",
					contactName: "",
					contactPhone: "",
					deviceAmount: 0,
					enterpriseId: 0,
					id: 0,
					name: "",
					orderIndex: 0,
					projectId: 0,
					projectName: "",
					remark: "",
					roadId: 0,
				},
			};
		},

		methods: {
			open(obj) {
				(this.detailShow = true);
				(this.detail = Object.assign(this.detail, obj));
				this.title = `查看施工单位(${this.detail.name})详情`
			},
		},
	};
</script>

<style scoped>
	p img {
		width: 100%;
	}

	.line {
		line-height: 50px;
		border-bottom: 1px solid #eee;
		padding: 0rpx 50px;
	}

	.header {
		background-color: #f3f3f3;
		font-weight: bold;
		padding: 0px 20px;
	}

	.line span {
		display: inline-block;
		width: 50%;
	}


	.line>h5 {
		display: inline-block;
		font-weight: bold;
	}
</style>
