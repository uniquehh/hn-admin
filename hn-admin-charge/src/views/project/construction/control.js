import request from "@/utils/request";
import {
	getToken
} from '@/utils/auth'

export default {
	components: {
		constunctionDetail: () => import("@/layout/components/constunctionDetail"),
		projectDetail: () => import("@/layout/components/ProjectDetail"),
		constructionMoneyLog: () => import("@/layout/components/constructionMoneyLog"),
	},
	name: "Construction",
	data() {
		return {
			// 是否显示弹出层
			open: false,
			// 遮罩层
			loading: true,
			// 总条数
			total: 10,
			//title
			title: "",
			// 查询参数
			queryParams: {
				page: 1,
				pageSize: 10,
				keyword: "",
				projectId: "",
				orderBy: 't.createTime',
				isAsc: 'desc'
			},
			tableData: [],

			//下拉选项
			options: [],

			form: {
				contactAddress: "",
				contactName: "",
				contactPhone: "",
				name: "",
				projectId: 0,
				remark: "",
			},

			// 表单校验
			rules: {
				name: [{
					required: true,
					message: "请输入施工单位名称",
					trigger: "blur",
				}, ],
				contactAddress: [{
					required: true,
					message: "请输入联系地址",
					trigger: "blur",
				}, ],
				contactName: [{
					required: true,
					message: "请输入负责人姓名",
					trigger: "blur",
				}, ],
				contactPhone: [{
						required: true,
						message: "请输入负责人电话",
						trigger: "blur",
					},
					{
						pattern: /^1[3|5|7|8|9]\d{9}$/,
						message: "请输入正确的号码格式",
						trigger: "blur",
					},
				],
				projectId: [{
					required: true,
					message: "请选择所属项目",
					trigger: "change",
				}, ],
			},


			// 是否显示弹出层
			openMoney: false,
			//titleMoney
			titleMoney: "",
			formMoney: {
				constructionEnterpriseId: 0,
				type: '',
				changeMoney: '',
				remark: "",
				imageList: []
			},
			// 表单校验
			rulesMoney: {
				type: [{
					required: true,
					message: "请选择变动类型",
					trigger: "change",
				}],
				changeMoney: [{
					required: true,
					message: "请输入变动金额",
					trigger: "blur",
				}]
			},
			uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',
			uploadHeaders: {
				PLATFORM: 'pc',
				token: getToken()
			}
		};
	},

	created() {
		this.getList();
		this.getProject();
	},

	methods: {
		getList() {
			this.loading = true;
			return request({
				url: "system/constructionEnterprise/queryList",
				method: "get",
				params: this.queryParams,
			}).then((res) => {
				this.tableData = res.rows;
				this.total = res.total;
				this.loading = false;
			});
		},

		//搜索
		handleQuery() {
			console.log(this.queryParams, "11111111");
			this.queryParams.page = 1;
			this.getList();
		},

		//获取项目
		getProject() {
			return request({
				url: "/system/project/getAll",
				method: "get",
				params: {},
			}).then((res) => {
				this.options = res.data;
			});
		},

		// 表单重置
		reset() {
			this.form = {};
			this.resetForm("form");
		},

		/** 修改按钮操作 */
		handleUpdata(row) {
			this.reset();
			this.editOpen = true;
			this.open = true;
			this.title = '编辑施工单位(' + row.name + ')';
			return request({
				url: `system/constructionEnterprise/queryById/${row.id}`,
				method: "get",
			}).then((res) => {
				this.form = res.data;
			});
		},

		//查看施工单位详情
		handleView(row) {
			this.editOpen = true;
			return request({
				url: `/system/constructionEnterprise/queryById/${row.id}`,
				method: "get",
			}).then((res) => {
				this.$refs["constunctionDetail"].open(res.data);
			});
		},

		//查看所属项目详情
		handleView2(row) {
			this.$refs.projectDetailRef.init(row.projectId);
		},

		//发布
		publish() {
			this.editOpen = true;
			this.open = true;
			this.title = "新增施工单位";
			this.reset();
		},

		/** 提交按钮 */
		submitForm: function() {
			this.editOpen = false;
			console.log(this.form, "formmmm");

			this.$refs["form"].validate((valid) => {
				console.log(valid);
				if (valid) {
					if (this.form.id != undefined) {
						return request({
							url: "/system/constructionEnterprise/update",
							method: "post",
							data: this.form,
						}).then((res) => {
							this.$modal.msgSuccess("修改成功");
							this.init();
						});
					} else {
						return request({
							url: "/system/constructionEnterprise/create",
							method: "post",
							data: this.form,
						}).then((res) => {
							this.$modal.msgSuccess("新增成功");
							this.init();
						});
					}
				}
			});
		},

		init() {
			this.open = false;
			this.tableData = [];
			this.getList();
		},

		/** 删除按钮操作 */
		handleDelete(row) {},

		cancel() {
			this.editOpen = false;
			this.open = false;
			this.reset();
		},

		/** 重置按钮操作 */
		resetQuery() {
			this.queryParams = {
					page: 1,
					pageSize: 10,
					keyword: "",
					projectId: "",
				},
				this.getList()
		},

		handleCheckAllChange(val) {
			this.checkedCities = val ? cityOptions : [];
			this.isIndeterminate = false;
		},
		handleCheckedCitiesChange(value) {
			let checkedCount = value.length;
			this.checkAll = checkedCount === this.cities.length;
			this.isIndeterminate =
				checkedCount > 0 && checkedCount < this.cities.length;
		},
		handleMoney(row) {
			this.openMoney = true;
			this.titleMoney = '施工单位(' + row.name + ')修改余额';
			this.resetMoney();
			this.formMoney.constructionEnterpriseId = row.id
		},
		// 表单重置
		resetMoney() {
			this.formMoney = {
				constructionEnterpriseId: 0,
				type: '',
				changeMoney: '',
				remark: "",
				imageList: []
			};
			this.resetForm("form2");
		},
		handleImagesSuccess(response, file, fileList) {
			this.formMoney.imageList = fileList;
		},
		handleImagesExceed(file, fileList) {
			this.$modal.msgError("最多上传6张");
		},
		handleImagesRemove(file, fileList) {
			this.formMoney.imageList = fileList;
		},
		cancelMoney() {
			this.openMoney = false;
			this.resetMoney();
		},
		submitFormMoney: function() {
			this.$refs["form2"].validate((valid) => {
				console.log(valid);
				if (valid) {
					let imageList = [];
					for (let item of this.formMoney.imageList) {
						if (item.status == "success") {
							imageList.push(item.response ? item.response.data : item.url);
						}
					}
					this.formMoney.images = imageList.join();
					return request({
						url: "/system/constructionEnterprise/money",
						method: "post",
						data: this.formMoney,
					}).then((res) => {
						this.$modal.msgSuccess("修改成功");
						this.getList();
						this.openMoney = false;
					});
				}
			});
		},
		//查看余额记录
		handleView3(row) {
			this.$refs.constructionMoneyLogRef.init(row.id,row.name);
		}
	},
};
