<template>

	<el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
		append-to-body :close-on-press-escape="true" :close-on-click-modal="true">

		<el-row>
			<el-table v-loading="loading" :data="tableData" border style="width: 100%">
				<el-table-column fixed prop="unionCode" align="center" label="电桩编码 ">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleStakeView(scope.row)">
							{{scope.row.unionCode}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="nodeName" label="枪号" align="center">
				</el-table-column>
				<el-table-column prop="type" align="center" label="电桩类型">
					<template slot-scope="scope">
						{{scope.row.type|typeFilter}}
					</template>
				</el-table-column>
				<el-table-column prop="ratedPower" align="center" label="额定功率(KW)">
				</el-table-column>
				<el-table-column prop="projectName" align="center" label="投放项目">
					<template slot-scope="scope">
						<el-link type="primary" @click="handleProjectView(scope.row)">
							{{scope.row.projectName}}
						</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="status" align="center" label="状态">
					<template slot-scope="scope">
						{{scope.row.status|statusFilter}}
					</template>
				</el-table-column>

			</el-table>
		</el-row>
		<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 查看电桩 -->
		<PowerStakeDetail ref="PowerStakeDetailRef" />

		<!-- 项目详情 -->
		<ProjectDetail ref="ProjectDetailRef" />
	</el-dialog>
</template>

<script>
	import http from "@/utils/request";
	export default {
		name: "AvailableleNode",
		components: {
			PowerStakeDetail: () => import('@/layout/components/PowerStakeDetail/index'),
			ProjectDetail: () => import('@/layout/components/ProjectDetail/index'),
		},
		// 传入参数
		props: {
			// "dialogShow": {
			//   type: Boolean
			// },
			// "title": {
			//   type: String
			// }
		},
		data() {
			return {
				id: null,
				total: 0,
				loading: false,
				title: "可用充电枪",
				dialogShow: false,
				queryParams: {
					page: 1,
					pageSize: 10,
					status: 0,
					stationId: undefined,
					orderBy: "t.createTime",
					isAsc: "desc",
				},
				tableData: [],
				detail: {},
			};
		},
		filters: {
			statusFilter(value) {
				let data = '';
				switch (value) {
					case -1:
						data = '未启用';
						break;
					case 0:
						data = '空闲';
						break;
					case 1:
						data = '已插枪未充电';
						break;
					case 2:
						data = '充电中';
						break;
					case 3:
						data = '充电结束未拔枪';
						break;
					case 4:
						data = '预约中';
						break;
					case 5:
						data = '故障';
						break;
					case 6:
						data = '离线';
						break;
				}
				return data;
			},
			typeFilter(value) {
				let data = '';
				switch (value) {
					case 1:
						data = '交流充电桩';
						break;
					case 2:
						data = '直流充电桩';
						break;
				}
				return data;
			},
		},
		methods: {
			getList() {
				this.loading = true;
				let that = this;
				http
					.request({
						url: "/system/chargingStation/queryPileNodeList",
						method: "get",
						params: this.queryParams,
					})
					.then((res) => {
						that.tableData = res.rows || [];
						that.total = res.total;
						that.loading = false;
						setTimeout(() => {
							this.dialogShow = true;
						}, 100);
					})
					.catch(() => {
						this.loading = false;
					});
			},
			initPageList() {
				this.queryParams.page = 1;
				this.total = 0;
				this.tableData = [];
				this.getList();
			},
			closeDialog() {
				this.dialogShow = false;
				// 向外部传递变量
				// this.$emit('dialogShowChange', false)
			},
			clear() {
				this.detail = {};
				this.id = null;
				this.tableData = [];
			},
			init(id, name) {
				this.id = id;
				this.title = "电站(" + name + ")可用充电枪";
				this.queryParams.stationId = id;
				this.initPageList();
			},
			handleStakeView(row) {
				this.$refs.PowerStakeDetailRef.init(row.id);
			},
			handleProjectView(row) {
				this.$refs.ProjectDetailRef.init(row.projectId);
			},
		},
	};
</script>
