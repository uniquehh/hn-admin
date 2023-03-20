<template>
	<div class="app-container">

		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="电桩编号" prop="keyword">
				<el-input v-model="queryParams.keyword" clearable placeholder="请输入电桩编号"
					@keyup.enter.native="handleQuery" />
			</el-form-item>

			<el-form-item label="投放项目" prop="projectId">
				<el-select v-model="queryParams.projectId" clearable filterable placeholder="请选择投放项目">
					<el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所属电站" prop="stationId">
				<el-select v-model="queryParams.stationId" clearable filterable placeholder="请选择所属电站">
					<el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width: 150px;">
					<el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" prop="type">
				<el-select v-model="queryParams.type" clearable placeholder="请选择类型" style="width: 120px">
					<el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:chargingPile:create']">新增</el-button>
				<el-button type="info" plain icon="el-icon-download" size="mini" @click="handleDownloadExportFile"
					v-hasPermi="['system:chargingPile:downloadTemplate']">下载导入模板
				</el-button>
				<el-button type="primary" plain icon="el-icon-upload" size="mini" @click="handleUpload"
					v-hasPermi="['system:chargingPile:import']">导入Excel</el-button>
				<el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:chargingPile:export']">导出Excel</el-button>
			</el-form-item>
		</el-form>

		<!-- <el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row> -->


		<el-row :gutter="15">
			<el-table v-loading="loading" :data="list" border>
				<el-table-column prop="unionCode" align="center" label="电桩编码" width="150" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView(scope.row)">
							{{scope.row.unionCode}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="type" align="center" label="电桩类型">
					<template slot-scope="scope">
						{{scope.row.type|typeFilter}}
					</template>
				</el-table-column>
				<el-table-column prop="code" align="center" label="桩位号">
				</el-table-column>
				<el-table-column prop="ratedPower" align="center" label="额定功率(KW)">
				</el-table-column>
				<el-table-column prop="stationName" align="center" label="所属电站" width="150" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleStationView(scope.row)">
							{{scope.row.stationName}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="chargeTemplateName" align="center" label="计费模板" width="150" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleBillingTemplateView(scope.row)">
							{{scope.row.chargeTemplateName}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="projectName" align="center" label="投放项目" width="150" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleProjectView(scope.row)">
							{{scope.row.projectName}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="firstNodeStatus" align="center" label="A枪状态">
					<template slot-scope="scope">
						{{scope.row.firstNodeStatus|statusFilter}}
					</template>
				</el-table-column>
				<el-table-column prop="secondNodeStatus" align="center" label="B枪状态">
					<template slot-scope="scope">
						{{scope.row.secondNodeStatus|statusFilter}}
					</template>
				</el-table-column>
				<el-table-column prop="serviceTimes" align="center" label="累计充电量次数">
				</el-table-column>
				<el-table-column prop="chargingCapacity" align="center" label="累计充电量(度)">
				</el-table-column>
				<el-table-column prop="chargingPrice" align="center" label="累计充电金额">
				</el-table-column>
				<el-table-column align="center" label="操作" fixed="right" width="120">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
							v-hasPermi="['system:chargingPile:update']">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
				@pagination="getList" />
		</el-row>

		<!-- 新增/编辑 -->
		<add-power-stake :title="title" :open.sync="openAdd" :id="detailId" @afterAdd="getList" />
		<!-- 导入 -->
		<import title="导入电桩" :open.sync="openImport" @afterAdd="getList" />

		<!-- 查看电桩 -->
		<PowerStakeDetail ref="PowerStakeDetailRef" />

		<!-- 查看电站 -->
		<PowerStationDetail ref="PowerStationDetailRef" />

		<!-- 查看项目 -->
		<ProjectDetail ref="ProjectDetailRef" />
		
		<!-- 查看模板详情 -->
		<BillingTemplateDetail ref="BillingTemplateDetailRef" />
	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>

<style scoped>
	.line {
		line-height: 40px;
		padding: 0rpx 50px;
		padding-left: 10px;
	}

	.line~.line {
		border-top: 1px solid #eee;
	}

	.header {
		background-color: #f3f3f3;
		line-height: 40px;
		font-weight: bold;
		margin: 0px -20px;
		padding: 0px 20px;
	}

	.header .el-button {
		margin-left: 20px;
	}

	.line span {
		display: inline-block;
		width: 50%;
	}
</style>
