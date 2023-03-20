<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-form size="small" :inline="true">
				<el-form-item>
					<el-button v-hasPermi="['system:banner:create']" type="primary" size="mini" icon="el-icon-plus" plain @click="handleAdd">新增</el-button>
					<el-button v-hasPermi="['system:banner:delete']" type="danger" size="mini" icon="el-icon-delete" plain :disabled="multiple"
						@click="handleDelete">删除</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<el-row :gutter="15">
			<el-table v-loading="loading" :data="list" border @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="50" align="center" />
				<el-table-column align="center" label="图片" width="250">
					<template slot-scope="scope">
						<ImagePreview :src="scope.row.imageUrl?scope.row.imageUrl:''" />
					</template>
				</el-table-column>

				<el-table-column prop="orderIndex" align="center" label="排序">
				</el-table-column>

				<el-table-column align="center" label="操作" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['system:banner:update']"
							@click="handleUpdate(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:banner:delete']"
							@click="handleDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
				@pagination="getList" />
		</el-row>

		<!-- 发布公告 -->
		<el-dialog :title="title" width="500px" :visible.sync="open" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-row>
					<el-col>
						<!-- <el-form-item label="上传图片:" prop="userName">
							<el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card"
								:on-preview="handlePictureCardPreview" :on-remove="handleRemove" size="mini">
								<i class="el-icon-plus"></i>
							</el-upload>
						</el-form-item> -->
						<el-form-item label="上传图片" prop="imageUrl">
							<span style="font-size:12px;margin-left:10px;color:#aaa;">(推荐尺寸: 325px * 200px)</span>
							<el-upload class="avatar-uploader" ref="upload" :action="uploadFileUrl"
								:headers="uploadHeaders" :show-file-list="false"
								:on-success="(response,file,fileList)=>handleImageUrlSuccess(response,file,fileList)"
								:limit="1" accept=".png,.jpg,.jpeg" :auto-upload="true">
								<img v-if="form.imageUrl!=''&&form.imageUrl" :src="form.imageUrl" class="avatar">
								<i v-else class="el-icon-plus avatar-uploader-icon"></i>
							</el-upload>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<!-- <el-form-item label="排序:" prop="userName">
						<el-input-number v-model="form.form2" controls-position="right" :min="1" size="mini">
						</el-input-number>
					</el-form-item> -->
					<el-form-item label="排序" prop="orderIndex">
						<el-input-number v-model="form.orderIndex" placeholder="请输入排序" controls-position="right"
							:min="1">
						</el-input-number>
					</el-form-item>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>


	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>

<style scoped>
	.dzIMg {
		width: 100px;
		height: 80px;
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
