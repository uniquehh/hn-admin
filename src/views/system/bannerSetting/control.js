import request from '@/utils/request'
import {
	getToken
} from '@/utils/auth'
export default {
	name: "BannerSetting",
	data() {
		return {
			// 遮罩层
			loading: true,
			// 选中数组
			ids: [],
			// 非多个禁用
			multiple: true,
			// 总条数
			total: 0,
			// 查询参数
			queryParams: {
				page: 1,
				pageSize: 10,
				orderBy: "orderIndex",
				isAsc: "asc",
			},
			list: [],

			// 是否显示弹出层
			open: false,
			//title
			title: "",
			form: {
				imageUrl: ''
			},
			rules: {
				imageUrl: [{
					required: true,
					message: "请上传图片",
					trigger: "change"
				}],
				orderIndex: [{
					required: true,
					message: "请输入排序",
					trigger: "blur"
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
	},
	methods: {
		getList() {
			this.loading = true;
			request({
				url: '/system/banner/queryList',
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
		// 多选框选中数据
		handleSelectionChange(selection) {
			this.ids = selection.map((item) => item.id);
			this.multiple = !selection.length;
		},
		handleDelete(row) {
			let ids = row.id
			if (ids) {
				ids = [ids]
			} else {
				ids = this.ids;
			}
			this.$modal.confirm('是否确认删除？').then(function() {
				return request({
					url: '/system/banner/deleteByIds',
					method: 'post',
					data: ids
				})
			}).then(() => {
				if (row.id) { //单条删除操作成功后，需要判断页数是否改变，刷新当前页或者上一页
					if (this.total % this.queryParams.pageSize == 1) {
						if (this.queryParams.page <= 2) {
							this.queryParams.page = 1;
						} else {
							this.queryParams.page -= 1;
						}
					}
					this.getList()
				} else { //批量删除，需要将page重置成1
					this.handleQuery();
				}
				this.$modal.msgSuccess('删除成功')
			}).catch(() => {})
		},
		handleAdd() {
			this.open = true;
			this.title = "添加banner";
			this.$nextTick(() => {
				this.resetDialogForm();
			});
			// this.form.imageUrl = '';
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.open = true;
			this.title = "编辑banner";
			this.resetDialogForm();
			this.loadDetail(row.id);
		},
		loadDetail(id) {
			request({
				url: '/system/banner/queryById/' + id,
				method: 'get'
			}).then(response => {
				this.form = response.data;
			})
		},
		cancel() {
			this.open = false;
			this.resetDialogForm();
		},
		resetDialogForm() {
			this.form = {
				imageUrl: ''
			}
			if (this.$refs.form !== undefined) {
				this.$refs.form.resetFields()
			}
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate((valid) => {
				if (valid) {
					console.log(this.form);
					if (this.form.id != undefined) {
						request({
							url: '/system/banner/update',
							method: 'post',
							data: this.form
						}).then((response) => {
							this.$modal.msgSuccess("修改成功");
							this.cancel();
							this.getList();
						});
					} else {
						request({
							url: '/system/banner/create',
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
		},
		handleImageUrlSuccess(response, file, fileList) {
			this.form.imageUrl = response.data
			// 上传成功后，手动验证一次表单imageUrl
			this.$refs.form.validateField('imageUrl')
			this.$forceUpdate()
			console.log(this.$refs.upload)
			this.$refs['upload'].clearFiles();
		},
	},
};
