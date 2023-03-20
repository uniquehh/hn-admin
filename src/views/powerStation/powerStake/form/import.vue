<template>
	<el-dialog :title="title" :visible="open" width="600px" append-to-body :show-close="true"
		@close="handClose">
		<el-upload class="upload-demo" ref="upload" :headers="uploadHeaders" :action="uploadFileUrl"
			:show-file-list="false" :auto-upload="true" :limit="1" accept=".xls,.xlsx" :before-upload="uploadBefore"
			:on-success="uploadSuccess" :on-error="uploadError">
			<el-button slot="trigger" size="small" type="primary" plain icon="el-icon-plus">选取文件导入</el-button>
		</el-upload>
		<div>
			<template v-for="result in resultMsg"><br />{{result}}</template>
		</div>
		<div slot="footer" class="dialog-footer" style="text-align: center;margin-top:10px;">
			<el-button type="primary" @click="handClose">关 闭</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import {
		getToken
	} from "@/utils/auth";
	export default {
		name: 'import',
		props: ['open', 'title'],
		data() {
			return {
				loading: undefined,
				uploadFileUrl: process.env.VUE_APP_BASE_API + "/system/chargingPile/importPile",
				uploadHeaders: {
					PLATFORM: 'pc',
					token: getToken()
				},
				resultMsg: undefined
			}
		},
		watch: {
			open(val) {
				if (val) {}
			}
		},
		methods: {
			handClose() {
				this.$emit('update:open', false)
				this.$refs.upload.clearFiles();
				this.resultMsg = undefined;
			},
			locaLoad() {
				this.loading = this.$loading({
					lock: true,
					text: '导入中...',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)'
				});
			},
			locaLoadEnd() {
				this.loading.close();
				this.$refs.upload.clearFiles();
			},
			uploadBefore(file) {
				console.log(this)
				this.resultMsg = undefined;
				this.locaLoad();
			},
			uploadSuccess(response, file, fileList) {
				this.locaLoadEnd();
				if (response.code != 1) {
					this.resultMsg = response.data;
					this.$modal.msgError(response.msg ? response.msg : '导入失败');
				} else {
					this.$modal.msgSuccess('导入成功');
					this.handClose();
					this.$emit('afterAdd');
				}
			},
			uploadError(err, file, fileList) {
				this.locaLoadEnd();
				this.$modal.msgError('导入失败');
			}
		}
	}
</script>

<style scoped>
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
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
