<template>
	<el-dialog :title="title" :visible="open" width="900px" style="min-width: 1000px;" append-to-body :show-close="true"
		@close="cancel">
		<el-form ref="form" :model="form" :rules="rules" label-width="105px">
			<el-row>
				<el-col :span="12">
					<el-form-item label="电桩编码" prop="unionCode">
						<el-input placeholder="请输入电桩编码" v-model="form.unionCode" style="max-width: 220px" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="10">
					<el-form-item label="桩位号" prop="code">
						<el-input placeholder="请输入电桩布点桩位号" v-model="form.code" style="max-width: 220px" />
					</el-form-item>
				</el-col>

				<el-col :span="10">
					<el-form-item label="投放日期" prop="releaseDate">
						<el-date-picker v-model="form.releaseDate" type="date" value-format="yyyy-MM-dd" placeholder="选择投放日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="10">
					<el-form-item label="生产日期" prop="productionDate">
						<el-date-picker v-model="form.productionDate" type="date" value-format="yyyy-MM-dd" placeholder="选择生产日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="10">
					<el-form-item label="服务截止日期" prop="endDate">
						<el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="选择服务截止日期">
						</el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="10">
					<el-form-item label="所属站" prop="chargingStationId">
						<el-select v-model="form.chargingStationId" clearable placeholder="请选择所属电站"
							@change="stationChange">
							<el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12">
					<el-form-item label="计费模板" prop="chargeTemplateId">
						<el-select v-model="form.chargeTemplateId" clearable placeholder="请选择计费模板">
							<el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>



		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="submitForm">确 定</el-button>
			<el-button @click="cancel">取 消</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import request from '@/utils/request'

	export default {
		name: "addPowerStake",
		props: {
			title: {
				type: String,
				default: ''
			},
			open: {
				type: Boolean,
				default: false
			},
			id: {
				type: Number | null,
				default: 0
			}
		},
		data() {
			return {
				form: {
					chargeTemplateId: ''
				},
				rules: {
					unionCode: [{
						required: true,
						message: "请输入电桩编码",
						trigger: "blur"
					}],
					code: [{
						required: true,
						message: "请输入电桩布点桩位号",
						trigger: "blur"
					}],
					chargingStationId: [{
						required: true,
						message: "请选择所属电站",
						trigger: "change"
					}],
					chargeTemplateId: [{
						required: true,
						message: "请选择计费模板",
						trigger: "change"
					}],
				},
				stationList: [],
				templateList: [],
			}
		},
		watch: {
			async open(val) {
				if (val) {
					this.resetForm();
					//得到所有计费模板
					this.getAllTemplate();
					//得到所有充电站
					this.getAllStation();
					if (this.id && this.id != 0) {
						this.loadDetail();
					}
				}
			}
		},
		methods: {
			loadDetail() {
				request({
					url: '/system/chargingPile/queryById/' + this.id,
					method: 'get'
				}).then(response => {
					this.form = response.data;
				})
			},
			getAllTemplate() {
				request({
					url: '/system/chargeTemplate/getAll',
					method: 'get',
				}).then((response) => {
					this.templateList = response.data
				})
			},
			getAllStation() {
				request({
					url: '/system/chargingStation/getAll',
					method: 'get',
				}).then((response) => {
					this.stationList = response.data
				})
			},
			//选择充电站
			stationChange(val) {
				let station = this.stationList.find(m => m.id == val);
				if (station) {
					this.form.chargeTemplateId = station.chargeTemplateId
				} else {
					this.form.chargeTemplateId = '';
				}
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate((valid) => {
					if (valid) {
						console.log(this.form);
						if (this.form.id != undefined) {
							request({
								url: '/system/chargingPile/update',
								method: 'post',
								data: this.form
							}).then((response) => {
								this.$modal.msgSuccess("修改成功");
								this.cancel();
								this.$emit('afterAdd')
							});
						} else {
							request({
								url: '/system/chargingPile/create',
								method: 'post',
								data: this.form
							}).then((response) => {
								this.$modal.msgSuccess("新增成功");
								this.cancel();
								this.$emit('afterAdd')
							});
						}
					}
				});
			},
			resetForm() {
				this.form = {
					chargeTemplateId: ''
				}
				if (this.$refs.form !== undefined) {
					this.$refs.form.resetFields()
				}
			},
			cancel() {
				this.resetForm();
				this.$emit('update:open', false)
			},
		}
	}
</script>

<style scoped lang="scss">
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		border: 1px solid #ddd;
		margin-top: 10px;
		font-size: 28px;
		color: #8c939d;
		width: 150px;
		height: 150px;
		line-height: 150px;
		text-align: center;
	}

	.avatar {
		width: 150px;
		height: 150px;
		display: block;
	}
</style>
