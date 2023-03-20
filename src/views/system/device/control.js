import request from '@/utils/request'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
	components: {
		Treeselect
	},
	name: "Device",
	data() {
		return {
			// 是否展开，默认全部折叠
			isExpandAll: false,
			// 重新渲染表格状态
			refreshTable: true,
			// 遮罩层
			loading: true,
			// 选中数组
			ids: [],
			// 非多个禁用
			multiple: true,
			list: [],

			// 是否显示弹出层
			open: false,
			//title
			title: "",
			form: {},
			rules: {
				typeName: [{
					required: true,
					message: "请输入设备类型名称",
					trigger: "blur"
				}]
			},
			// 菜单树选项
			menuOptions: [],
		};
	},
	created() {
		this.getList();
	},
	methods: {
		getList() {
			this.loading = true;
			request({
				url: '/system/carType/queryList',
				method: 'get'
			}).then((response) => {
				for (let top of response.data) {
					top.level = 0;
					for (let second of top.children) {
						top.level = 1;
						for (let third of second.children) {
							third.level = 2;
						}
					}
				}
				this.list = response.data;
				this.loading = false;
			}).catch(() => {
				this.loading = false;
			});
		},

		// 多选框选中数据
		handleSelectionChange(selection) {
			this.ids = selection.map((item) => item.id);
			this.multiple = !selection.length;
		},
		/** 展开/折叠操作 */
		toggleExpandAll() {
			this.refreshTable = false;
			this.isExpandAll = !this.isExpandAll;
			this.$nextTick(() => {
				this.refreshTable = true;
			});
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
					url: '/system/carType/deleteByIds',
					method: 'post',
					data: ids
				})
			}).then(() => {
				this.getList()
				this.$modal.msgSuccess('删除成功')
			}).catch(() => {})
		},
		handleAdd(row) {
			this.open = true;
			this.title = "添加设备类型";
			this.$nextTick(() => {
				this.resetDialogForm();
				this.getTreeselect();
				if (row != null && row.id) {
					this.form.parentId = row.id;
				} else {
					this.form.parentId = 0;
				}
			});
			// this.form.imageUrl = '';
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.open = true;
			this.title = "编辑设备类型";
			this.resetDialogForm();
			this.getTreeselect();
			this.loadDetail(row.id);
		},
		/** 转换菜单数据结构 */
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.id,
				label: node.typeName,
				children: node.children
			};
		},
		/** 查询菜单下拉树结构 */
		getTreeselect() {
			request({
				url: '/system/carType/queryList',
				method: 'get'
			}).then(response => {
				this.menuOptions = [];
				const menu = {
					id: 0,
					typeName: '主类型',
					children: []
				};
				let children = response.data;
				for (let top of children) {
					for (let second of top.children) {
						second.children = [];
					}
				}
				menu.children = children
				this.menuOptions.push(menu);
			});
		},

		loadDetail(id) {
			request({
				url: '/system/carType/queryById/' + id,
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
			this.form = {}
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
							url: '/system/carType/update',
							method: 'post',
							data: this.form
						}).then((response) => {
							this.$modal.msgSuccess("修改成功");
							this.cancel();
							this.getList();
						});
					} else {
						request({
							url: '/system/carType/create',
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
	},
};
