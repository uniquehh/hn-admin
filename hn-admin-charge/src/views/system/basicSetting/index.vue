<template>
	<div class="app-container">
		<el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="120px">
			<section>
				<div class="header line">平台电话</div>
				<p>
					<el-form-item label="客服电话:" prop="serviceTel">
						<el-input placeholder="请输入" clearable v-model="form.serviceTel" clearable />
					</el-form-item>
				</p>
			</section>

			<section>
				<div class="header line">App版本管理</div>
				
				<p>
					<el-row>
						<el-form-item label="下载页面背景图片:" prop="downloadPageImageUrl">
							<span style="font-size:12px;margin-left:10px;color:#aaa;">(推荐尺寸: 无)</span>
							<el-upload class="avatar-uploader" ref="upload2" :action="uploadFileUrl"
								:headers="uploadHeaders" :show-file-list="false"
								:on-success="(response,file,fileList)=>handleImageUrlSuccess(response,file,fileList)"
								:limit="1" accept=".png,.jpg,.jpeg" :auto-upload="true">
								<img v-if="form.downloadPageImageUrl!=''&&form.downloadPageImageUrl" :src="form.downloadPageImageUrl" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-row>
				</p>
				
				<p>
					<el-row>
						<el-form-item label="安卓版本号:" prop="versionAndroid">
							<el-input placeholder="请输入版本号" clearable v-model="form.versionAndroid" clearable />
						</el-form-item>
						<el-form-item label="是否强制更新">
							<el-checkbox v-model="form.forcedUpdateAndroid" />
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="安卓安装包:" prop="pathAndroid">
							<!-- <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" multiple
								:limit="1" :action="uploadFileUrl" :headers="uploadHeaders" accept=".apk">
								<el-button size="small" type="primary">点击上传</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 20px">
									支持扩展名：.apk
								</span>
							</el-upload> -->

							<el-upload class="upload-demo" ref="upload" :limit="1"  :action="uploadFileUrl" :headers="uploadHeaders" accept=".apk"
								:on-success="(response,file,fileList)=>handlePathAndroidSuccess(response,file,fileList)"								
								:on-error="(err, file, fileList)=>handlePathAndroidError(err,file,fileList)"	
								:on-remove="(file,fileList)=>handlePathAndroidRemove(file,fileList)"
								:on-exceed="(file,fileList)=>handlePathAndroidExceed(file,fileList)"
								:file-list="form.pathAndroidList">
								<el-button slot="trigger" size="small" type="primary">点击上传</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 20px">
									支持扩展名：.apk
								</span>
							</el-upload>
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="安卓更新说明文案:" prop="commentAndroid">
							<el-input v-model="form.commentAndroid" type="textarea" clearable rows="3"
								placeholder="请输入更新说明文案" :maxlength="300" show-word-limit style="width: 500px" />
						</el-form-item>
					</el-row>
				</p>

				<p>
					<el-row>
						<el-form-item label="IOS版本号:" prop="versionIos">
							<el-input placeholder="请输入版本号" clearable v-model="form.versionIos" clearable />
						</el-form-item>
						<el-form-item label="是否强制更新">
							<el-checkbox v-model="form.forcedUpdateIos" />
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="IOS下载地址:" prop="pathIos">
							<el-input placeholder="请输入IOS下载地址" v-model="form.pathIos" clearable style="width: 500px" />
						</el-form-item>
					</el-row>
					<el-row>
						<el-form-item label="IOS更新说明文案:" prop="commentIos">
							<el-input v-model="form.commentIos" type="textarea" clearable rows="3"
								placeholder="请输入更新说明文案" :maxlength="300" show-word-limit style="width: 500px" />
						</el-form-item>
					</el-row>
				</p>
			</section>

			<section>
				<div class="header line">文案管理</div>

				<p>
					<el-form-item label="使用说明:">
						<editor :minHeight="200" :height="200" :maxWidth="800" v-model="form.useDescription"></editor>
					</el-form-item>
				</p>

				<p>
					<el-form-item label="用户协议:">
						<editor :minHeight="200" :height="200" :maxWidth="800" v-model="form.userAgreement"></editor>
					</el-form-item>
				</p>

				<p>
					<el-form-item label="隐私协议:">
						<editor :minHeight="200" :height="200" :maxWidth="800" v-model="form.privacyAggrement"></editor>
					</el-form-item>
				</p>


			</section>
		</el-form>

		<div slot="footer" style="margin:20px 0px 0px 110px">
			<el-button type="primary" v-hasPermi="['system:setting:update']" @click="submitForm">保存</el-button>
		</div>
	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>

<style scoped>
	.line {
		line-height: 40px;
		border: 1px solid #eee;
		padding: 0rpx 50px;
	}

	.header {
		background-color: #f3f3f3;
		font-size: 15px;
		font-weight: bold;
		padding: 0px 8px;
	}

	section {
		border: 1px solid #eee;
	}

	section p {
		padding: 15px 0px;
	}

	section+section {
		margin-top: 10px;
	}
	
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
