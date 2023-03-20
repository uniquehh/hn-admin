<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-form size="small" :inline="true">
				<el-form-item label="关键字" prop="menuName">
					<el-input placeholder="请输入施工单位/负责人/电话" style="width:190px" clearable
						v-model="queryParams.keyword" />
				</el-form-item>

				<el-form-item label="所属项目" prop="menuName">
					<el-select v-model="queryParams.projectId" filterable clearable placeholder="请选择所属项目">
						<el-option v-for="item in options" :key="item.id" :label="item.projectName" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					<el-button v-hasPermi="['system:constructionEnterprise:create']" type="primary" size="mini"
						icon="el-icon-plus" plain @click="publish">新增</el-button>

				</el-form-item>
			</el-form>
		</el-row>

		<el-row>
			<el-table :data="tableData" v-loading="loading" border :rules="'rules'" style="width: 100%">
				<el-table-column fixed prop="name" align="center" label="施工单位 ">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView(scope.row)">{{
              scope.row.name
            }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="id" label="所属项目编号" align="center">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView2(scope.row)">{{
              scope.row.projectCode
            }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="projectName" align="center" label="所属项目">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView2(scope.row)">{{
              scope.row.projectName
            }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="contactName" align="center" label="负责人">
				</el-table-column>
				<el-table-column prop="contactPhone" align="center" label="负责人电话">
				</el-table-column>
				<el-table-column prop="money" align="center" label="余额" width="120">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView3(scope.row)">{{scope.row.money}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="deviceAmount" align="center" label="设备数量" width="120">
				</el-table-column>
				<el-table-column prop="chargingCapacity" align="center" label="累计充电量（度）" width="120">
				</el-table-column>
				<el-table-column prop="chargingPrice" align="center" label="累计充电金额" width="120">
				</el-table-column>
				<el-table-column align="center" label="操作" fixed="right" width="190">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdata(scope.row)"
							v-hasPermi="['system:constructionEnterprise:update']">编辑</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleMoney(scope.row)"
							v-hasPermi="['system:constructionEnterprise:money']">修改余额</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>

		<!-- 新增施工单位 -->
		<el-dialog :title="title" width="50%" :visible.sync="open" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="105px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="施工单位名称:" prop="name">
							<el-input placeholder="请输入施工单位名称" v-model="form.name" />
						</el-form-item>
					</el-col>

					<el-col :span="12">
						<el-form-item label="联系地址:" prop="contactAddress">
							<el-input placeholder="请输入联系地址" v-model="form.contactAddress" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item label="负责人:" prop="contactName">
							<el-input placeholder="请输入负责人" v-model="form.contactName" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="负责人电话:" prop="contactPhone">
							<el-input placeholder="请输入负责人电话" v-model="form.contactPhone" type="number" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-form-item label="所属项目:" prop="projectId">
						<el-select clearable placeholder="请选择所属施工单位" v-model="form.projectId">
							<el-option v-for="item in options" :key="item.id" :label="item.projectName"
								:value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>

				<el-row>
					<el-form-item label="备注:">
						<el-input placeholder="请输入备注" v-model="form.remark" type="textarea" />
					</el-form-item>
				</el-row>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 修改余额 -->
		<el-dialog :title="titleMoney" width="600px" :visible.sync="openMoney" append-to-body>
			<el-form ref="form2" :model="formMoney" :rules="rulesMoney" label-width="80px">
				<el-form-item label="修改类型" prop="type">
					<el-select v-model="formMoney.type" clearable filterable placeholder="请选择变动类型">
						<el-option label="充值" :value="0" />
						<el-option label="扣除" :value="1" />
					</el-select>
				</el-form-item>
				<el-form-item label="修改金额" prop="changeMoney">
					<el-input-number v-model="formMoney.changeMoney" clearable placeholder="请输入变动金额"
						controls-position="right" :min="0.0001" :precision=4 :step="0.0001"></el-input-number>
				</el-form-item>

				<el-form-item label="凭证" prop="images">
					<span style="font-size:12px;margin-left:10px;color:#aaa;">(推荐尺寸: 无)</span>
					<el-upload class="avatar-uploader" ref="upload" :action="uploadFileUrl" :headers="uploadHeaders"
						:file-list="formMoney.imageList" list-type="picture-card"
						:on-success="(response,file,fileList)=>handleImagesSuccess(response,file,fileList)"
						:multiple="true" :limit="6" accept=".png,.jpg,.jpeg" :auto-upload="true"
						:on-exceed="(file,fileList)=>handleImagesExceed(file,fileList)"
						:on-remove="(file,fileList)=>handleImagesRemove(file,fileList)">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="formMoney.remark" type="textarea" rows="4" placeholder="请输入备注" :maxlength="400"
						show-word-limit />
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFormMoney">确 定</el-button>
				<el-button @click="cancelMoney">取 消</el-button>
			</div>
		</el-dialog>


		<!-- 施工单位详情 -->
		<constunctionDetail ref="constunctionDetail" />
		<!-- 项目详情 -->
		<projectDetail ref="projectDetailRef" />
		<!-- 余额记录 -->
		<constructionMoneyLog ref="constructionMoneyLogRef" />

		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
			@pagination="getList" />
	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>

<style scoped></style>
