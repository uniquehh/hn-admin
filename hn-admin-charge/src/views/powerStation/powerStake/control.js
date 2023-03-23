import AddPowerStake from "./form/index";
import Import from './form/import'
import request from '@/utils/request'
export default {
	components: {
		AddPowerStake,
		Import,
		PowerStakeDetail: () => import('@/layout/components/PowerStakeDetail/index'),
		PowerStationDetail: () => import('@/layout/components/PowerStationDetail/index'),
		ProjectDetail: () => import('@/layout/components/ProjectDetail/index'),		
		BillingTemplateDetail: () => import('@/layout/components/BillingTemplateDetail/index')
	},
	name: "PowerStake",
	data() {
		return {
			openAdd: false,
			title: '',
			detailId: '',
			openImport: false,

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
				keyword: undefined,
				projectId: undefined,
				stationId: undefined,
				status: undefined,
				type: undefined,
				orderBy: "t.createTime",
				isAsc: "desc",
			},
			list: [],

			//下拉选项
			projectList: [],
			stationList: [],
			statusList: [{
					value: -1,
					label: '未启用'
				}, {
					value: 0,
					label: '空闲'
				},
				{
					value: 1,
					label: '已插枪未充电'
				}, {
					value: 2,
					label: '充电中'
				}, {
					value: 3,
					label: '充电结束未拔枪'
				}, {
					value: 4,
					label: '预约中'
				}, {
					value: 5,
					label: '故障'
				}, {
					value: 6,
					label: '离线'
				},
			],
			typeList: [{
				value: 1,
				label: '交流充电桩'
			}, {
				value: 2,
				label: '直流充电桩'
			}, ]
		};
	},
	created() {
		//所有项目
		this.getAllProject();
		//所有电站
		this.getAllStation();
		this.getList();
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
		getAllProject() {
			request({
				url: '/system/project/getAll',
				method: 'get',
			}).then((response) => {
				this.projectList = response.data
			});
		},
		getAllStation() {
			request({
				url: '/system/chargingStation/getAll',
				method: 'get',
			}).then((response) => {
				this.stationList = response.data
			});
		},
		getList() {
			this.loading = true;
			console.log(this.queryParams)
			request({
				url: '/system/chargingPile/queryList',
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
		//下载导入模板
		handleDownloadExportFile() {
			// var a = document.createElement("a"); //创建一个<a></a>标签
			// a.href = "/static/upload_template/充电桩导入模板.xls"; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
			// a.download = "充电桩导入模板.xls"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
			// a.style.display = "none"; // 障眼法藏起来a标签
			// document.body.appendChild(a); // 将a标签追加到文档对象中
			// a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
			// a.remove(); // 一次性的，用完就删除a标签
			this.download('/system/chargingPile/downloadTemplate', {
				...this.queryParams
			}, `充电桩数据导入模板.xls`)
		},
		//导入
		handleUpload() {
			this.openImport = true;
		},
		//导出
		handleExport() {
			this.download('/system/chargingPile/export', {
				...this.queryParams
			}, `电桩管理_${new Date().getTime()}.xls`)
		},
		handleAdd() {
			this.detailId = ''
			this.title = '添加电桩'
			this.openAdd = true
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.detailId = row.id
			this.title = "编辑电桩"
			this.openAdd = true
		},
		//详情
		handleView(row) {
			this.$refs.PowerStakeDetailRef.init(row.id);
		},
		handleStationView(row) {
			this.$refs.PowerStationDetailRef.init(row.chargingStationId);
		},
		handleProjectView(row) {
			this.$refs.ProjectDetailRef.init(row.projectId);
		},
		//模板详情
		handleBillingTemplateView(row) {
			this.$refs.BillingTemplateDetailRef.init(row.chargeTemplateId);
		},
	},
};
