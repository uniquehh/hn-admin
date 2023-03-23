<template>
	<el-dialog :title="title" :visible="open" width="50%" style="min-width: 1000px;" append-to-body :show-close="true"
		@close="cancel">
		<el-form ref="form" :model="form" :rules="rules" label-width="100px">
			<!-- <el-row>
    		<el-col :span="12"> -->
			<el-form-item label="上传缩略图" prop="coverImg">
				<span style="font-size:12px;margin-left:10px;color:#aaa;">(推荐尺寸: 300px * 300px)</span>
				<el-upload class="avatar-uploader" ref="upload" :action="uploadFileUrl" :headers="uploadHeaders"
					:show-file-list="false"
					:on-success="(response,file,fileList)=>handleCoverImgSuccess(response,file,fileList)" :limit="1"
					accept=".png,.jpg,.jpeg" :auto-upload="true">
					<img v-if="form.coverImg!=''&&form.coverImg" :src="form.coverImg" class="avatar">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-form-item>
			<!-- 	</el-col>
    	</el-row> -->

			<el-form-item label="上传位置示意图" prop="positionImg">
				<span style="font-size:12px;margin-left:10px;color:#aaa;">(推荐尺寸: 无)</span>
				<el-upload class="avatar-uploader" ref="upload1" :action="uploadFileUrl" :headers="uploadHeaders"
					:file-list="form.positionImgList" list-type="picture-card"
					:on-success="(response,file,fileList)=>handlePositionImgSuccess(response,file,fileList)"
					:multiple="true" :limit="10" accept=".png,.jpg,.jpeg" :auto-upload="true"
					:on-exceed="(file,fileList)=>handlePositionImgExceed(file,fileList)"
					:on-remove="(file,fileList)=>handlePositionImgRemove(file,fileList)">
					<i class="el-icon-plus"></i>
				</el-upload>
			</el-form-item>

			<el-row>
				<el-col :span="12">
					<el-form-item label="电站名称" prop="name">
						<el-input placeholder="请输入电站名称" v-model="form.name" />
					</el-form-item>
				</el-col>

				<el-col :span="11">
					<el-form-item label="选择计费模板" prop="chargeTemplateId">
						<el-select v-model="form.chargeTemplateId" clearable filterable placeholder="请选择计费模板">
							<el-option v-for="item in templateList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="11">
					<el-form-item label="投放项目" prop="projectId">
						<el-select v-model="form.projectId" clearable filterable placeholder="请选择站点投放项目"
							@change="projectChange">
							<el-option v-for="item in projectList" :key="item.id" :label="item.projectName"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="11">
					<el-form-item v-if="form.roadName" label="投放道路" prop="userName" label-width="140px">
						{{form.roadName}}
					</el-form-item>
				</el-col>


			</el-row>

			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入备注" :maxlength="200"
					show-word-limit />
			</el-form-item>

			<el-row>
				<el-form-item label="行政区域" prop="area">
					<el-cascader clearable v-model="form.area" :options="areaList" :props="areaPropsForm"
						@change="changeArea">
					</el-cascader>
				</el-form-item>
			</el-row>
			<el-row>
				<el-form-item label="地图坐标" prop="lat">
					<Map ref="map" @updateLocation="updateLocation" :initPoint="initPoint" />
				</el-form-item>
			</el-row>
			<el-row>
				<el-form-item label="详细地址" prop="address">
					<el-input placeholder="请输入或选择详细地址" v-model="form.address" clearable />
				</el-form-item>
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
	import {
		getToken
	} from '@/utils/auth'
	import Map from "@/components/Amap/index";

	export default {
		name: "addPowerList",
		components: {
			Map
		},
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
					coverImg: '',
					area: '',
					lat: '',
					address: '',
					positionImgList: []
				},
				initPoint: {},
				rules: {
					coverImg: [{
						required: true,
						message: "请上传缩略图",
						trigger: "change"
					}],
					name: [{
						required: true,
						message: "请输入电站名称",
						trigger: "blur"
					}],
					chargeTemplateId: [{
						required: true,
						message: "请选择计费模板",
						trigger: "change"
					}],
					projectId: [{
						required: true,
						message: "请选择站点投放项目",
						trigger: "change"
					}],
					area: [{
						required: true,
						message: "请选择行政区域",
						trigger: "change"
					}],
					address: [{
						required: true,
						message: "请输入或选择详细地址",
						trigger: "change"
					}],
					lat: [{
						required: true,
						message: "请选择坐标点",
						trigger: "change"
					}]
				},
				templateList: [],
				projectList: [],
				areaList: [],
				areaPropsForm: {
					value: 'name',
					label: 'name',
					children: 'children'
				},
				uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',
				uploadHeaders: {
					PLATFORM: 'pc',
					token: getToken()
				}
			}
		},
		watch: {
			async open(val) {
				if (val) {
					this.resetForm();
					//得到所有计费模板
					this.getAllTemplate();
					//得到所有项目
					this.getAllProject();
					//得到所有区域数据
					this.getAllArea();
					if (this.id && this.id != 0) {
						this.loadDetail();
					}
				}
			}
		},
		methods: {
			loadDetail() {
				request({
					url: '/system/chargingStation/queryById/' + this.id,
					method: 'get'
				}).then(response => {
					response.data.positionImgList = [];
					if (response.data.positionImg) {
						let positionImgList = response.data.positionImg.split(',');
						for (let positionImg of positionImgList) {
							response.data.positionImgList.push({
								name: '',
								url: positionImg
							})
						}
					}
					response.data.area = [];
					if (response.data.province) response.data.area.push(response.data.province);
					if (response.data.city) response.data.area.push(response.data.city);
					if (response.data.district) response.data.area.push(response.data.district);
					this.form = response.data;
					this.initPoint = {
						lat: this.form.lat,
						lon: this.form.lng,
						province: this.form.province,
						city: this.form.city,
						district: this.form.district
					}
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
			getAllProject() {
				request({
					url: '/system/project/getAll',
					method: 'get',
				}).then((response) => {
					this.projectList = response.data
				})
			},
			getAllArea() {
				request({
					url: '/system/system/area/list',
					method: 'get',
				}).then((response) => {
					this.areaList = response.data
				})
			},
			//选择项目
			projectChange(val) {
				let project = this.projectList.find(m => m.id == val);
				if (project) {
					this.form.roadName = project.roadName
				} else {
					this.form.roadName = '';
				}
			},
			changeArea(val) {
				if (val) {
					let province = val[0];
					let city = val[1] || '';
					let district = val[2] || '';
					let lng = '';
					let lat = '';
					let provinceItem = this.areaList.find(m => m.name == province);
					if (provinceItem) {
						lng = provinceItem.lng
						lat = provinceItem.lat
						if (provinceItem.children && provinceItem.children.length > 0) {
							let cityItem = provinceItem.children.find(m => m.name == city);
							if (cityItem) {
								lng = cityItem.lng
								lat = cityItem.lat
								if (cityItem.children && cityItem.children.length > 0) {
									let districtItem = cityItem.children.find(m => m.name == district);
									if (districtItem) {
										lng = districtItem.lng
										lat = districtItem.lat
									}
								}
							}
						}
					}
					this.initPoint = {
						lat: lat,
						lon: lng,
						province: province,
						city: city,
						district: district
					}
					this.form.address = ''
					this.form.lng = lng
					this.form.lat = lat
					// 手动验证一次表单lat
					this.$refs.form.validateField('lat')
					this.form.province = province
					this.form.city = city
					this.form.district = district
				}
			},
			updateLocation(val) {
				this.form.address = val.orgAddr
				this.form.lng = val.lon
				this.form.lat = val.lat
				// 手动验证一次表单lat
				this.$refs.form.validateField('lat')
				this.form.province = val.province
				this.form.city = val.city
				this.form.district = val.district

				let area = [];
				if (val.province) area.push(val.province);
				if (val.city) area.push(val.city);
				if (val.district) area.push(val.district);
				this.form.area = area;
				//手动验证一次表单area
				this.$refs.form.validateField('area')
				this.$forceUpdate();
			},

			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate((valid) => {
					if (valid) {
						console.log(this.form);
						let positionImgList = [];
						for (let item of this.form.positionImgList) {
							if (item.status == "success") {
								positionImgList.push(item.response ? item.response.data : item.url);
							}
						}
						this.form.positionImg = positionImgList.join();
						if (this.form.id != undefined) {
							request({
								url: '/system/chargingStation/update',
								method: 'post',
								data: this.form
							}).then((response) => {
								this.$modal.msgSuccess("修改成功");
								this.cancel();
								this.$emit('afterAdd')
							});
						} else {
							request({
								url: '/system/chargingStation/create',
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
					coverImg: '',
					area: '',
					lat: '',
					address: '',
					positionImgList: []
				}
				this.initPoint = null;
				if (this.$refs.form !== undefined) {
					this.$refs.form.resetFields()
				}
			},
			cancel() {
				this.resetForm();
				this.$emit('update:open', false)
			},
			handleCoverImgSuccess(response, file, fileList) {
				this.form.coverImg = response.data
				// 上传成功后，手动验证一次表单coverImg
				this.$refs.form.validateField('coverImg')
				this.$forceUpdate()
				console.log(this.$refs.upload)
				this.$refs['upload'].clearFiles();
			},
			handlePositionImgSuccess(response, file, fileList) {
				this.form.positionImgList = fileList;
			},
			handlePositionImgExceed(file, fileList) {
				this.$modal.msgError("最多上传10张");
			},
			handlePositionImgRemove(file, fileList) {
				this.form.positionImgList = fileList;
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
