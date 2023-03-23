<template>
	<div class="carinfo">
		<el-dialog title="车辆设备详情" width="800px" :visible.sync="showDialog" append-to-body>
			<el-form ref="carDialogForm" class="carinfo" :model="dialogData" label-width="100px">
				<el-row>
					<el-col>
						<el-form-item label="设备图片：">
							<!-- <img class="equipimg" v-if="dialogData.imageUrl" :src="dialogData.imageUrl" /> -->
							<ImagePreview :width="100" :height="100" :src="dialogData.imageUrl?dialogData.imageUrl:''" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="设备编码：">
							<div>{{ dialogData.code }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备名称：">
							<div>{{ dialogData.name }}</div>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="所属项目：">
							<div>{{ dialogData.projectName }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="作业司机：">
							<span class="drivername" v-for="(item, index) in dialogData.drivers" :key="index + 'a'">{{ item.driverName }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="所属分类：">
							<div>{{ dialogData.firstName }}-{{ dialogData.sencondName }}-{{ dialogData.thirdName }}</div>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="所属施工单位：">
							<div>{{ dialogData.constructionEnterpriseName }}</div>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-table :data="tableData" border style="width: auto">
				<el-table-column prop="code" label="设备编码"></el-table-column>
				<el-table-column prop="name" label="设备名称"></el-table-column>
				<!-- 	<el-table-column prop="firstName" label="所属分类">
					<template slot-scope="scope">
						{{ scope.row.firstName }}-{{ scope.row.secondName }}-{{ scope.row.thirdName }}
					</template>
				</el-table-column> -->
				<el-table-column prop="projectName" label="所属项目">
					<template slot-scope="scope">
						<el-link type="primary" @click="viewProject(scope.row)">{{ scope.row.projectName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="constructionEnterpriseName" label="所属施工单位">
					<template slot-scope="scope">
						<el-link type="primary" @click="viewConstunction(scope.row)">{{ scope.row.constructionEnterpriseName }}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="accessFlag" label="类别">
					<template slot-scope="scope">
						{{ scope.row.accessFlag == 2 ? '离场' : scope.row.accessFlag == 1 ? '进场' : '' }}
					</template>
				</el-table-column>
				<el-table-column prop="createBy" label="操作人"></el-table-column>
				<el-table-column prop="createTime" label="时间"></el-table-column>
			</el-table>
			<pagination
				v-show="total > 0"
				:total="total"
				:page.sync="queryParams.page"
				:limit.sync="queryParams.pageSize"
				@pagination="getList"
				:page-sizes="[5, 10, 20, 50, 100]"
			/>
			<projectDetail ref="projectDetail" />
			<constunctionDetail ref="constunctionDetail" />
		</el-dialog>
	</div>
</template>

<script>
import request from '@/utils/request';
import http from '@/utils/request';
export default {
	components: {
		projectDetail: () => import('@/layout/components/ProjectDetail'),
		constunctionDetail: () => import('@/layout/components/constunctionDetail')
	},
	name: 'carDetail',
	data() {
		return {
			id: null,
			total: 0,
			loading: false,
			title: '查看车辆详情',
			showDialog: false,
			tableData: [],
			queryParams: {
				page: 1,
				pageSize: 5,
				carId: 0,
				roleKey: undefined,
				status: undefined,
				orderBy: 'l.create_time',
				isAsc: 'desc'
			},
			dialogData: {
				imageUrl: '',
				code: '',
				name: '',
				firstName: '',
				sencondName: '',
				thirdName: '',
				projectName: '',
				constructionEnterpriseName: '',
				drivers: []
			}
		};
	},
	methods: {
		viewProject(row) {
			this.$refs.projectDetail.init(row.projectId);
		},
		viewConstunction(row) {
			return request({
				url: `/system/constructionEnterprise/queryById/${row.constructionEnterpriseId}`,
				method: 'get'
			}).then(res => {
				this.$refs.constunctionDetail.open(res.data);
			});
		},
		initPageList() {
			this.queryParams.page = 1;
			this.total = 0;
			this.tableData = [];
			this.getList();
		},

		clear() {
			this.tableData = [];
		},
		getList() {
			this.loading = true;
			let that = this;
			http.request({
				url: '/system/car/queryAccessLogList',
				method: 'get',
				params: this.queryParams
			})
				.then(res => {
					that.tableData = res.rows || [];
					that.total = res.total;
					that.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		// 父组件调用该方法打开弹窗查看详情
		openCarIndoDialog(id) {
			this.id = id;
			this.queryParams.carId = id;
			this.clear();
			this.showDialog = true;
			this.$nextTick(() => {
				this.getCarInfo(id).then(res => {
					this.dialogData = res.data;
				});
				this.initPageList();
			});
		},

		getCarInfo(id) {
			return request({
				url: `system/car/queryById/${id}`,
				method: 'GET',
				params: {}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.carinfo {
	.equipimg {
		width: 70px;
		height: 70px;
	}
	.drivername {
		margin-right: 10px;
	}
	.el-form-item {
		margin-bottom: 0;
	}
	.el-row {
		padding: 10px 0;
		border-bottom: 1px solid #d9d9d9;
	}
	& :last-child {
		border: none;
	}
}
</style>
