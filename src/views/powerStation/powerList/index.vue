<template>
	<div class="app-container">

		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="电站名称" prop="name">
				<el-input v-model="queryParams.name" clearable placeholder="请输入电站名称"
					@keyup.enter.native="handleQuery" />
			</el-form-item>

			<el-form-item label="投放项目" prop="projectId">
				<el-select v-model="queryParams.projectId" clearable filterable placeholder="请选择站点投放项目">
					<el-option v-for="item in options" :key="item.id" :label="item.projectName" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="所属道路" prop="roadId">
				<el-select v-model="queryParams.roadId" clearable filterable placeholder="请选择所属道路">
					<el-option v-for="item in options2" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" clearable placeholder="请选择状态" style="width: 100px">
					<el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="行政区域" prop="area">
				<el-cascader clearable v-model="queryParams.area" :options="options4" :props="option4Props">
				</el-cascader>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:chargingStation:create']">新增</el-button>
				<el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:chargingStation:export']">导出Excel</el-button>
			</el-form-item>
		</el-form>

		<!-- <el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row> -->

		<el-row :gutter="15">
			<el-table v-loading="loading" :data="list" border>
				<el-table-column align="center" label="电站图片" width="100">
					<template slot-scope="scope">
						<ImagePreview :src="scope.row.coverImg?scope.row.coverImg:''" />
					</template>
				</el-table-column>
				<el-table-column prop="name" align="center" label="电站名称" width="150" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView(scope.row)">
							{{scope.row.name}}
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
				<el-table-column prop="roadName" align="center" label="投放道路" width="150" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="regionName" align="center" label="行政区域" width="150" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="address" align="center" label="电站位置" width="150" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="status" align="center" label="状态">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.status==0" type="success">启用</el-tag>
						<el-tag v-if="scope.row.status==1" type="danger">禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="pileAmount" align="center" label="充电桩数量">
				</el-table-column>
				<el-table-column prop="availablePileNodeAmount" align="center" label="可用枪数量">
					<template slot-scope="scope">
						<el-link type="primary" @click="handAvailableleNodeView(scope.row)">
							{{scope.row.availablePileNodeAmount}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="failurePileNodeAmount" align="center" label="故障枪数量">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleFailureNodeView(scope.row)">
							{{scope.row.failurePileNodeAmount}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="serviceTimes" align="center" label="累计服务次数">
				</el-table-column>
				<el-table-column prop="chargingCapacity" align="center" label="累计充电量（度）">
				</el-table-column>
				<el-table-column prop="chargingPrice" align="center" label="累计充电金额">
					<template slot-scope="scope">
						<span>{{'￥'+scope.row.chargingPrice}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" align="center" label="创建日期">
				</el-table-column>
				<el-table-column align="center" label="操作" fixed="right" width="170">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
							v-hasPermi="['system:chargingStation:update']">编辑</el-button>
						<el-button v-if="scope.row.status==0" size="mini" type="text" icon="el-icon-lock"
							@click="handleStatus(scope.row)" v-hasPermi="['system:chargingStation:updateStatus']">禁用
						</el-button>
						<el-button v-if="scope.row.status==1" size="mini" type="text" icon="el-icon-unlock"
							@click="handleStatus(scope.row)" v-hasPermi="['system:chargingStation:updateStatus']">启用
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
				@pagination="getList" />
		</el-row>

		<!-- 新增/编辑 -->
		<add-power-list :title="title" :open.sync="openAdd" :id="detailId" @afterAdd="getList" />

		<!-- 查看电站详情 -->
		<PowerStationDetail ref="PowerStationDetailRef" />

		<!-- 项目详情 -->
		<ProjectDetail ref="ProjectDetailRef" />

		<!-- 可用充电枪 -->
		<AvailableleNode ref="AvailableleNodeRef" />

		<!-- 故障充电枪 -->
		<FailureNode ref="FailureNodeRef" />

		<!-- 查看模板详情 -->
		<BillingTemplateDetail ref="BillingTemplateDetailRef" />
	</div>
</template>

<script>
	import control from "./control.js";
	export default control;
</script>
