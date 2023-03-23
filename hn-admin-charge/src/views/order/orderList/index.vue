<template>
	<div class="app-container">
		<el-row :gutter="10">
			<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
				<el-form-item label="关键字" prop="keyword"><el-input placeholder="请输入订单号/司机/手机号" clearable v-model="queryParams.keyword" /></el-form-item>

				<el-form-item label="订单所属项目" prop="projectId">
					<el-select v-model="queryParams.projectId" filterable clearable placeholder="全部">
						<el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>

        <el-form-item label="所属电站" prop="stationId">
          <el-select v-model="queryParams.stationId" filterable clearable placeholder="全部">
          	<el-option v-for="item in stationList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </el-form-item>

				<el-form-item label="订单状态" prop="status">
					<el-select v-model="queryParams.status" clearable placeholder="全部" style="width: 100px">
						<el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="订单日期" prop="value2">
					<el-date-picker
						v-model="value2"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						@change="selectSearchDateRange"
						value-format="yyyy-MM-dd"
					></el-date-picker>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
					<!-- <el-button type="primary" size="mini" @click="handleUpdata">详情</el-button> -->
					<el-button type="primary" size="mini" @click="exportExcel" v-hasPermi="['system:order:export']">导出Excel</el-button>
				</el-form-item>
			</el-form>
		</el-row>

		<el-row :gutter="1">
			<el-col :span="5">
				<div class="text">累计充电度数(度)：{{ statistics.totalCharge }}</div>
			</el-col>
			<el-col :span="5">
				<div class="text">累计订单总额(元)：{{ statistics.totalMoney }}</div>
			</el-col>
		</el-row>

		<el-row>
			<el-table :data="tableData" style="width: 100%" v-loading="loading" border :highlight-current-row="true" row-key="id" :stripe="true">
				<el-table-column fixed prop="orderNo" width="170" align="center" label="订单号">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleView(scope.row)">{{ scope.row.orderNo }}</el-link>
						<el-badge v-if="scope.row.completeFlag == 1" class="mark" value="挂" />
					</template>
				</el-table-column>
				<el-table-column prop="status"  label="订单状态" align="center">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.status == 0" type="danger">充电就绪</el-tag>
						<el-tag v-else-if="scope.row.status == 1" type="success">充电中</el-tag>
						<el-tag v-else-if="scope.row.status == 2" type="info">已完成</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="driverName" width="100" align="center" label="充电司机"></el-table-column>
				<el-table-column prop="carCode" width="150" align="center" label="设备编码"></el-table-column>
				<el-table-column prop="driverPhone" width="100" align="center" label="司机号码">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleDriverView(scope.row)">{{ scope.row.driverPhone }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="chargingStationName" width="150" align="center" label="充电站">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleViewStation(scope.row)">{{ scope.row.chargingStationName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="projectName" width="150" align="center" label="订单所属项目">
					<template slot-scope="scope">
						<el-link type="primary" @click="showProjectDetail(scope.row)">{{ scope.row.projectName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="startTime" width="150" align="center" label="充电开始时间"></el-table-column>
				<el-table-column prop="chargeSeconds" width="120" align="center" label="充电时长">
					<template slot-scope="scope">
						{{formatSeconds(scope.row.chargeSeconds)}}
					</template>
				</el-table-column>
				<el-table-column prop="totalCharge" width="80" align="center" label="充电量（度)"></el-table-column>
				<el-table-column prop="totalMoney" width="80" align="center" label="订单总额(元)"></el-table-column>
				<el-table-column prop="totalElectricMoney" width="80" align="center" label="电费金额(元)"></el-table-column>
				<el-table-column prop="totalServiceMoney" width="80" align="center" label="服务费金额(元)"></el-table-column>
				<el-table-column align="center" label="操作" fixed="right" width="150">
					<template slot-scope="scope">
						<el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
						<el-button
							v-if="scope.row.completeFlag == 1"
							size="mini"
							type="text"
							icon="el-icon-circle-check"
							@click="handleComplete(scope.row)"
							v-hasPermi="['system:order:complete']"
						>
							完成订单
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-row>

		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize" @pagination="getList"/>

		<projectDetail ref="projectDetailRef" />
		<orderDetail ref="orderDetailRef" />
		<driverDetail ref="driverDetailRef" />
		<PowerStationDetail ref="PowerStationDetailRef" />
	</div>
</template>

<script>
import control from './control.js';
export default control;
</script>

<style scoped>
.text {
	color: #515a6e;
	line-height: 23px;
	font-size: 15px;
	font-weight: bold;
	margin-bottom: 8px;
}

.line {
	line-height: 40px;
	border-bottom: 1px solid #eee;
	padding: 0rpx 50px;
	padding-left: 10px;
}

.header {
	background-color: #f3f3f3;
	font-weight: bold;
	margin: 0px -20px;
	padding: 0px 20px;
}

.line span {
	display: inline-block;
	width: 50%;
}
</style>
