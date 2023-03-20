<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="模板名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入计费模板名称" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="添加日期">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:chargeTemplate:create']">新增</el-button>
			</el-form-item>
		</el-form>

		<!-- <el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				
				<el-button type="danger" size="mini" icon="el-icon-delete" plain :disabled="multiple"
					@click="handleDelete">删除</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row> -->


		<el-row :gutter="15">
			<el-table v-loading="loading" :data="list" border @selection-change="handleSelectionChange">
				<!-- <el-table-column type="selection" width="50" align="center" /> -->
				<el-table-column label="计费模板名称" prop="name" align="center" :show-overflow-tooltip="true"
					label-width="auto">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView(scope.row)">
							{{scope.row.name}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column label="添加时间" align="center" prop="createTime">
					<template slot-scope="scope">
						<span>{{parseTime(scope.row.createTime)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit"
							v-hasPermi="['system:chargeTemplate:update']" @click="handleUpdate(scope.row)">编辑
						</el-button>
						<!-- <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:user:remove']"
							@click="handleDelete(scope.row)">删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
				@pagination="getList" />
		</el-row>


		<!-- 计费模板弹窗 -->
		<el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-row>
					<el-form-item label="模板名称" prop="name">
						<el-input v-model="form.name" placeholder="请输入计费模板名称" style="width:250px;" />
					</el-form-item>
				</el-row>

				<section>
					<div class="header line">设置时段</div>
					<el-col v-for="time,index in timeList" :key="index" :span="12" style="height: 25px;">
						<el-form-item :label="time.startTime+'~'+time.endTime+'：'" label-width="100px">
							<el-radio-group v-model="time.type">
								<el-radio :label="0">尖时</el-radio>
								<el-radio :label="1">峰时</el-radio>
								<el-radio :label="2">平时</el-radio>
								<el-radio :label="3">谷时</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</section>

				<el-table :data="form.priceList">
					<el-table-column prop="data" :label="'设置价格'">
						<template slot-scope="scope">
							<el-form-item :label="scope.row.data1" :prop="'priceList.' + scope.$index + '.price'"
								:rules="rules.price">
								<el-input-number v-model="scope.row.price" controls-position="right" :min="0"
									:precision=4 :step="0.0001"></el-input-number>
							</el-form-item>
						</template>
					</el-table-column>
					<el-table-column prop="data2">
						<template slot-scope="scope">
							<el-form-item :label="scope.row.data2"
								:prop="'priceList.' + scope.$index + '.serviceCharge'" :rules="rules.serviceCharge">
								<el-input-number v-model="scope.row.serviceCharge" controls-position="right" :min="0"
									:precision=4 :step="0.0001"></el-input-number>
							</el-form-item>
						</template>
					</el-table-column>
				</el-table>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">保存</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 查看模板详情 -->
		<BillingTemplateDetail ref="BillingTemplateDetailRef" />
	</div>
</template>

<style scoped>
	/* .header {
		background-color: #909399;
		color: #333;
		height: 30px;
		line-height: 30px;
	} */
	.line {
		line-height: 40px;
		border: 1px solid #eee;
		padding: 0rpx 50px;
	}

	.header {
		background-color: #f3f3f3;
		font-size: 12px;
		font-weight: bold;
		padding: 0px 8px;
	}
</style>

<script>
	import control from "./control.js";
	export default control;
</script>
