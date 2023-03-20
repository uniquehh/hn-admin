import request from '@/utils/request'
import {
	getToken
} from '@/utils/auth'
export default {
	components: {
		BillingTemplateDetail: () => import('@/layout/components/BillingTemplateDetail/index')
	},	
	name: "BillingTemplate",
	data() {
		return {
			// 遮罩层
			loading: true,
			// 选中数组
			ids: [],
			// 显示搜索条件
			showSearch: true,
			// 非多个禁用
			multiple: true,
			// 总条数
			total: 0,
			// 查询参数
			queryParams: {
				page: 1,
				pageSize: 10,
				name: undefined,
				orderBy: "createTime",
				isAsc: "desc",
			},
			// 日期范围
			dateRange: [],
			list: [],

			// 是否显示弹出层
			open: false,
			//title
			title: "",
			form: {
				priceList: [{
						data1: "尖时电价",
						price: 0,
						serviceCharge: 0,
						data2: "尖时服务费",
					},
					{
						data1: "峰时电价",
						price: 0,
						serviceCharge: 0,
						data2: "峰时服务费",
					},
					{
						data1: "平时电价",
						price: 0,
						serviceCharge: 0,
						data2: "平时服务费",
					},
					{
						data1: "谷时电价",
						price: 0,
						serviceCharge: 0,
						data2: "谷时服务费",
					},
				],
			},
			timeList: [],
			rules: {
				name: [{
					required: true,
					message: "请输入计费模板名称",
					trigger: "blur"
				}],
				price: [{
					required: true,
					message: "请输入电价",
					trigger: "blur"
				}],
				serviceCharge: [{
					required: true,
					message: "请输入服务费",
					trigger: "blur"
				}]
			},
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList() {
			this.loading = true;
			const params = this.queryParams;
			if (this.dateRange && this.dateRange.length > 0) {
				params.startDate = this.dateRange[0];
				params.endDate = this.dateRange[1];
			} else {
				params.startDate = '';
				params.endDate = '';
			}
			request({
				url: '/system/chargeTemplate/queryList',
				method: 'get',
				params: params
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
			this.dateRange = [];
			this.resetForm("queryForm");
			// this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
			this.handleQuery(); //如果有排序，则不需要手动触发搜索，设置排序会触发排序事件，排序事件里面有搜索
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			// this.ids = selection.map((item) => item.id);
			// this.multiple = !selection.length;
		},
		handleDelete(row) {
			let ids = row.id
			// if (ids) {
			// 	ids = [ids]
			// } else {
			// 	ids = this.ids;
			// }
			this.$modal.confirm('是否确认删除？').then(function() {
				return request({
					url: '/system/chargeTemplate/deleteByIds',
					method: 'post',
					data: ids
				})
			}).then(() => {
				if (this.total % this.queryParams.pageSize == 1) {
					if (this.queryParams.page <= 2) {
						this.queryParams.page = 1;
					} else {
						this.queryParams.page -= 1;
					}
				}
				this.getList()
				this.$modal.msgSuccess('删除成功')
			}).catch(() => {})
		},
		handleAdd() {
			this.open = true;
			this.title = "添加计费模板";
			this.$nextTick(() => {
				this.resetDialogForm();
				this.loadAllTime();
			});
			// this.form.imageUrl = '';
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.open = true;
			this.title = "编辑计费模板";
			this.resetDialogForm();
			this.loadAllTime();
			this.loadDetail(row.id);
		},
		//详情
		handleView(row) {
			this.$refs.BillingTemplateDetailRef.init(row.id);
		},
		//获取所有计费时段
		loadAllTime() {
			request({
				url: '/system/chargeTemplate/queryTimeInterval',
				method: 'get'
			}).then(response => {
				for (let time of response.data) {
					time.type = 2;
				}
				this.timeList = response.data;
			})
		},
		loadDetail(id) {
			request({
				url: '/system/chargeTemplate/queryTimeInterval',
				method: 'get'
			}).then(response => {
				request({
					url: '/system/chargeTemplate/queryById/' + id,
					method: 'get'
				}).then(response2 => {
					let priceList = this.form.priceList
					this.form = response2.data;
					for (let time of response.data) {
						let existsTime = this.form.times.find(m => m.timeIntervalId == time.id)
						if (existsTime) {
							time.type = existsTime.timeIntervalType
						} else {
							time.type = 2;
						}
					}
					this.timeList = response.data
					priceList[0].price = this.form.tipPrice;
					priceList[0].serviceCharge = this.form.tipServiceCharge;
					priceList[1].price = this.form.peakPrice;
					priceList[1].serviceCharge = this.form.peakServiceCharge;
					priceList[2].price = this.form.flatPrice;
					priceList[2].serviceCharge = this.form.flatServiceCharge;
					priceList[3].price = this.form.valleyPrice;
					priceList[3].serviceCharge = this.form.valleyServiceCharge;
					this.form.priceList = priceList
				})
			})
		},
		cancel() {
			this.open = false;
			this.resetDialogForm();
		},
		resetDialogForm() {
			this.timeList = [];
			this.form = {
				priceList: [{
						data1: "尖时电价",
						price: 0,
						serviceCharge: 0,
						data2: "尖时服务费",
					},
					{
						data1: "峰时电价",
						price: 0,
						serviceCharge: 0,
						data2: "峰时服务费",
					},
					{
						data1: "平时电价",
						price: 0,
						serviceCharge: 0,
						data2: "平时服务费",
					},
					{
						data1: "谷时电价",
						price: 0,
						serviceCharge: 0,
						data2: "谷时服务费",
					},
				],
			};
			if (this.$refs.form !== undefined) {
				this.$refs.form.resetFields()
			}
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					this.form.tipPrice = this.form.priceList[0].price;
					this.form.tipServiceCharge = this.form.priceList[0].serviceCharge;
					this.form.peakPrice = this.form.priceList[1].price;
					this.form.peakServiceCharge = this.form.priceList[1].serviceCharge;
					this.form.flatPrice = this.form.priceList[2].price;
					this.form.flatServiceCharge = this.form.priceList[2].serviceCharge;
					this.form.valleyPrice = this.form.priceList[3].price;
					this.form.valleyServiceCharge = this.form.priceList[3].serviceCharge;
					let times = [];
					for (let time of this.timeList) {
						times.push({
							timeIntervalId: time.id,
							timeIntervalType: time.type ? time.type : 0
						})
					}
					this.form.times = times;
					console.log(this.form);
					if (this.form.id != undefined) {
						request({
							url: '/system/chargeTemplate/update',
							method: 'post',
							data: this.form
						}).then((response) => {
							this.$modal.msgSuccess("修改成功");
							this.cancel();
							this.getList();
						});
					} else {
						request({
							url: '/system/chargeTemplate/create',
							method: 'post',
							data: this.form
						}).then((response) => {
							this.$modal.msgSuccess("新增成功");
							this.cancel();
							this.getList();
						});
					}
				}
			});
		}
	},
};
