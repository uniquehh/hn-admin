import http from '@/utils/request'
import myExport from "@/vendor/myExportExcel"
export default {
	components: {
		//引入组件
		projectDetail: () => import('@/layout/components/ProjectDetail'),
		orderDetail: () => import('@/layout/components/OrderDetail'),
		driverDetail: () => import("@/layout/components/DriverInfo"),
		PowerStationDetail: () => import('@/layout/components/PowerStationDetail/index')
	},
	name: "OrderList",
	data() {
		return {
			// 是否显示弹出层
			open: false,
			// 总条数
			total: 10,
			//title
			title: "",
			// 遮罩层
			loading: true,
			// 显示搜索条件
			showSearch: true,
			// 查询参数
			queryParams: {
				page: 1,
				pageSize: 10,
				keyword: "",
				projectId: '',
        stationId:'',
        stationName:'',
				startDate: '',
				endDate: '',
				status: '',
				roleKey: undefined,
				orderBy: 't.create_time',
				isAsc: 'desc'
			},
			value2: '',
			statistics: {
				totalCharge: 0,
				totalMoney: 0
			},
			tableData: [],
			//下拉选项
			projectList: [],
      stationList:[],
			statusOption: [
				{
					value: "1",
					label: "充电中",
				},
				{
					value: "2",
					label: "已完成",
				},
			],
			projectDetail: {
				// 要查看的用户
				id: null,
				// 弹出层标题
				title: "查看项目详情",
				// 是否显示弹出层
				dialogShow: false,
			},
			orderDetail: {
				// 要查看的用户
				id: null,
				// 弹出层标题
				title: "查看订单详情",
				// 是否显示弹出层
				dialogShow: false,
			},
		};
	},
	filters: {
		showStatusFilter(value) {
			return value == 0 ? '充电中' : '已完成';
		}
	},
	created() {
		this.getAllProject();
    this.getAllStation();
		this.handleQuery();
	},

	methods: {
    getAllStation(){
      http.get("/system/chargingStation/getAll").then(res=>{
        this.stationList=res.data||[];
      });
    },
		handleViewStation(row) {
			this.$refs.PowerStationDetailRef.init(row.chargingStationId);
		},
		handleDriverView(row) {
			this.$refs.driverDetailRef.getDinfo(row.driverId);
		},
		showProjectDetail(row) {
			this.$refs.projectDetailRef.init(row.projectId);
		},
		handleView(row) {
			this.$refs.orderDetailRef.init(row.id);
		},
		handleComplete(row) {
			let that = this;
			let id = row.id;
			this.$modal.confirm('确定要完成订单"' + row.orderNo + '"吗？').then(function() {
				return http.request({
					url: '/system/order/completeOrder/' + id,
					method: 'get'
				})
			}).then(() => {
				that.getList();
				this.$modal.msgSuccess('订单完成处理')
			}).catch(() => {})
		},
		getAllProject() {
			let that = this;
			http.request({
				url: '/system/project/getAll',
				method: 'get'
			}).then((res) => {
				if (res.data && res.data.length > 0) {
					that.projectList = that.projectList.concat(res.data);
				}
			})
		},
		selectSearchDateRange(date) {
			this.queryParams.startDate = date[0];
			this.queryParams.endDate = date[1];
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.tableData = [];
			this.getList();
			this.getStatistics();
		},

		/** 重置按钮操作 */
		resetQuery() {
			this.queryParams = {
				page: 1,
				pageSize: 10,
				keyword: "",
				projectId: '',
        stationId:'',
        stationName:'',
				startDate: '',
				endDate: '',
				status: '',
				roleKey: undefined,
				orderBy: 't.create_time',
				isAsc: 'desc'
			}
			this.value2 = '';
			this.resetForm("queryForm");
			this.handleQuery();
		},
		getStatistics() {
			let that = this;
			http.request({
				url: '/system/order/getStatistics',
				method: 'get',
				params: this.queryParams
			}).then((res) => {
				that.statistics = res.data;
			}).catch(() => {});
		},
		getList() {
			this.loading = true;
			let that = this;
			http.request({
				url: '/system/order/queryList',
				method: 'get',
				params: this.queryParams
			}).then((res) => {
				that.tableData = res.rows || [];
				that.total = res.total;
				that.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},

		// 导出表格
		exportExcel() {
			this.download('/system/order/export', {
				...this.queryParams
			}, `订单数据列表_${new Date().getTime()}.xls`)
		},
	},
};
