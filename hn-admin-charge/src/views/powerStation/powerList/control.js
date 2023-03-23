import AddPowerList from "./form/index";
import request from '@/utils/request'
export default {
	components: {
		AddPowerList,
		PowerStationDetail: () => import('@/layout/components/PowerStationDetail/index'),
		ProjectDetail: () => import('@/layout/components/ProjectDetail'),
		AvailableleNode: () => import('@/layout/components/PowerStationDetail/AvailableleNode'),
		FailureNode: () => import('@/layout/components/PowerStationDetail/FailureNode'),
		BillingTemplateDetail: () => import('@/layout/components/BillingTemplateDetail/index')
	},
	name: "PowerList",
	data() {
		return {
			openAdd: false,
			title: '',
			detailId: '',

			// 遮罩层
			loading: true,
			// 显示搜索条件
			showSearch: true,
			// 总条数
			total: 0,
			// 查询参数
			queryParams: {
				page: 1,
				pageSize: 10,
				name: undefined,
				projectId: undefined,
				roadId: undefined,
				status: undefined,
				area: undefined,
				orderBy: "t.createTime",
				isAsc: "desc",
			},
			list: [],

			//下拉选项
			options: [],

			options2: [],

			options3: [{
					value: 0,
					label: '启用'
				},
				{
					value: 1,
					label: '禁用'
				},
			],

			options4: [],
			option4Props: {
				value: 'name',
				label: 'name',
				children: 'children',
				checkStrictly: true, //选择任意一级
			},
		};
	},
	created() {
		//所有项目
		this.getAllProject();
		//所有道路
		this.getAllRoad();
		//区域数据
		this.getAllArea();
		this.getList();
	},
	methods: {
		getAllProject() {
			request({
				url: '/system/project/getAll',
				method: 'get',
			}).then((response) => {
				this.options = response.data
			});
		},
		getAllRoad() {
			request({
				url: '/system/road/getAll',
				method: 'get',
			}).then((response) => {
				this.options2 = response.data
			});
		},
		getAllArea() {
			request({
				url: '/system/system/area/list',
				method: 'get',
			}).then((response) => {
				this.options4 = response.data
			});
		},
		getList() {
			this.loading = true;
			console.log(this.queryParams)
			if (this.queryParams.area && this.queryParams.area.length > 0) {
				if (this.queryParams.area.length > 0) {
					this.queryParams.province = this.queryParams.area[0];
				}
				if (this.queryParams.area.length > 1) {
					this.queryParams.city = this.queryParams.area[1];
				}
				if (this.queryParams.area.length > 2) {
					this.queryParams.district = this.queryParams.area[2];
				}
			} else {
				this.queryParams.province = undefined;
				this.queryParams.city = undefined;
				this.queryParams.district = undefined;
			}
			request({
				url: '/system/chargingStation/queryList',
				method: 'get',
				params: this.queryParams
			}).then((response) => {
				this.list = response.rows;
				this.total = response.total;
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.queryParams.page = 1;
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.queryParams.page = 1;
			this.queryParams.area = undefined;
			this.resetForm("queryForm");
			// this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
			this.handleQuery(); //如果有排序，则不需要手动触发搜索，设置排序会触发排序事件，排序事件里面有搜索
		},
		//导出
		handleExport() {
			if (this.queryParams.area && this.queryParams.area.length > 0) {
				if (this.queryParams.area.length > 0) {
					this.queryParams.province = this.queryParams.area[0];
				}
				if (this.queryParams.area.length > 1) {
					this.queryParams.city = this.queryParams.area[1];
				}
				if (this.queryParams.area.length > 2) {
					this.queryParams.district = this.queryParams.area[2];
				}
			} else {
				this.queryParams.province = undefined;
				this.queryParams.city = undefined;
				this.queryParams.district = undefined;
			}
			this.download('/system/chargingStation/export', {
				...this.queryParams
			}, `电站列表_${new Date().getTime()}.xls`)
		},
		handleAdd() {
			this.detailId = ''
			this.title = '添加电站'
			this.openAdd = true
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.detailId = row.id
			this.title = "编辑电站"
			this.openAdd = true
		},
		//修改状态
		handleStatus(row) {
			this.$modal.confirm('是否确认修改？').then(function() {
				return request({
					url: '/system/chargingStation/updateStatus/' + row.id,
					method: 'post',
				})
			}).then(() => {
				this.getList()
				this.$modal.msgSuccess('操作成功')
			}).catch(() => {})
		},
		//详情
		handleView(row) {
			this.$refs.PowerStationDetailRef.init(row.id);
		},
		//项目详情
		handleProjectView(row){
			this.$refs.ProjectDetailRef.init(row.projectId);
		},
		//可用枪
		handAvailableleNodeView(row) {
			this.$refs.AvailableleNodeRef.init(row.id,row.name);
		},
		//故障枪
		handleFailureNodeView(row) {
			this.$refs.FailureNodeRef.init(row.id,row.name);
		},
		//模板详情
		handleBillingTemplateView(row) {
			this.$refs.BillingTemplateDetailRef.init(row.chargeTemplateId);
		},
	},
};
