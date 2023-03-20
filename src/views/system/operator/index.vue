<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="关键字" prop="keyword">
				<el-input v-model="queryParams.keyword" placeholder="登录账号/真实姓名/手机号" clearable style="width: 180px"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="所属角色" prop="roleId">
				<el-select v-model="queryParams.roleId" filterable clearable placeholder="所属角色" clearable>
					<el-option v-for="role in searchRoleList" :key="role.roleId" :label="role.roleName"
						:value="role.roleId" />
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="状态" clearable>
					<el-option label="正常" value="0" />
					<el-option label="冻结" value="1" />
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10">
			<el-form size="small" :inline="true">
				<el-form-item>
					<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
						v-hasPermi="['system:user:add']">新增</el-button>
				</el-form-item>
			</el-form>
			<!-- <el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:user:add']">新增</el-button>
			</el-col> -->
			<!-- 	<el-col :span="1.5">
				<el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
					@click="handleStatusChange(1)" v-hasPermi="['system:user:edit']">冻结</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
					@click="handleStatusChange(0)" v-hasPermi="['system:user:edit']">解冻</el-button>
			</el-col> -->
		</el-row>

		<el-row :gutter="15">
			<el-table v-loading="loading" :data="userList" border @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" :selectable="selectAbled" />
				<el-table-column label="登录账号" prop="userName" width="120" align="center" />
				<el-table-column label="所属角色" prop="roleName" :show-overflow-tooltip="true" width="150"
					align="center" />
				<el-table-column label="真实姓名" prop="nickName" :show-overflow-tooltip="true" width="150"
					align="center" />
				<el-table-column label="手机号" prop="phonenumber" :show-overflow-tooltip="true" width="150"
					align="center" />
				<el-table-column label="状态" align="center" width="100">
					<template slot-scope="scope">
						<span v-bind="statusUserColor(scope.row.status)">{{statusUserConfig(scope.row.status)}}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否接收故障信息" align="center" width="150">
					<template slot-scope="scope">
						<span
							v-bind="warnReceiverColor(scope.row.warnReceiver)">{{scope.row.warnReceiver=='0'?'否':'是'}}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center" prop="createTime" width="180">
					<template slot-scope="scope">
						<span>{{ parseTime(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope" v-if="scope.row.id !== 1">
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
							v-hasPermi="['system:user:edit']">编辑</el-button>
						<el-button size="mini" type="text" icon="el-icon-edit" @click="handleResetPwd(scope.row)"
							v-hasPermi="['system:user:resetPwd']">初始化密码</el-button>
						<el-button v-if="scope.row.status==0" size="mini" type="text" icon="el-icon-lock"
							@click="handleStatusChange(scope.row)" v-hasPermi="['system:user:status']">冻结
						</el-button>
						<el-button v-if="scope.row.status==1" size="mini" type="text" icon="el-icon-unlock"
							@click="handleStatusChange(scope.row)" v-hasPermi="['system:user:status']">解冻
						</el-button>
						<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
							v-hasPermi="['system:user:remove']">删除</el-button>

					</template>
				</el-table-column>
			</el-table>

			<pagination v-show="total>0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
				@pagination="getList" />
		</el-row>

		<!-- 添加或修改角色配置对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="140px">
				<el-form-item label="登录账号" prop="userName">
					<el-input v-model="form.userName" />
				</el-form-item>
				<el-form-item label="真实姓名" prop="nickName">
					<el-input v-model="form.nickName" />
				</el-form-item>
				<el-form-item label="手机号" prop="phonenumber">
					<el-input v-model="form.phonenumber" />
				</el-form-item>
				<!-- <el-form-item label="登录密码" prop="password" v-if="!editOpen">
					<el-input v-model="form.password" type="password" auto-complete="off" placeholder="密码" />
				</el-form-item> -->
				<el-form-item label="所属角色" prop="currentRole">
					<el-select v-model="form.currentRole" placeholder="所属角色" style="width: 240px">
						<el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName"
							:value="role.roleId" />
					</el-select>
				</el-form-item>
				<el-form-item label="接收充电桩故障短信" prop="warnReceiver">
					<el-radio-group v-model="form.warnReceiver">
						<el-radio :label="'1'">接收</el-radio>
						<el-radio :label="'0'">不接收</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item class="ps" v-if="showTipsfont">
					注：默认密码为手机号码后8位，登录后可自行修改
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>


		<!-- 	<el-dialog title="修改登录密码" :visible.sync="resetPwdOpen" width="500px" append-to-body>
			<el-form ref="form2" :model="form2" :rules="rules2" label-width="100px">
				<el-form-item label="登录密码" prop="password">
					<el-input v-model="form2.password" type="password" auto-complete="off" placeholder="密码" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitResetPwd">确 定</el-button>
				<el-button @click="cancelResetPwd">取 消</el-button>
			</div>
		</el-dialog> -->

	</div>
</template>

<script>
	import {
		listRole
	} from "@/api/system/role";
	import {
		listOperatorUser,
		addUser,
		getUser,
		updateUser,
		delUser,
		changeUserStatus,
		resetUserPwd
	} from "@/api/system/user";
	import {
		deepClone
	} from '@/utils/index'

	export default {
		name: "Operator",
		data() {
			return {
				// 遮罩层
				loading: true,

				// 选中数组
				ids: [],
				// 非单个禁用
				single: true,
				// 非多个禁用
				multiple: true,
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 角色表格数据
				roleList: [],
				//角色搜索列表
				searchRoleList: [],
				userList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				editOpen: false,

				queryParams: {
					page: 1,
					pageSize: 10,
					keyword: undefined,
					roleId: undefined,
					status: undefined,
					orderBy: "s.createTime",
					isAsc: "desc",
				},
				// 日期范围
				dateRange: [],


				// dialog提示语
				showTipsfont: false,
				// 表单参数
				form: {
					currentRole: '',
				},
				defaultProps: {
					children: "children",
					label: "label"
				},
				// 表单校验
				rules: {
					userName: [{
						required: true,
						message: "登录账号不能为空",
						trigger: "blur"
					}],
					nickName: [{
						required: true,
						message: "真实姓名不能为空",
						trigger: "blur"
					}],
					password: [{
						required: true,
						message: "登录密码不能为空",
						trigger: "blur"
					}],
					phonenumber: [{
							required: true,
							message: "手机号码不能为空",
							trigger: "blur"
						},
						{
							pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
							message: "请输入正确的手机号码",
							trigger: "blur"
						}
					],
					currentRole: [{
						required: true,
						message: "请选择所属角色",
						trigger: "change"
					}],
					warnReceiver: [{
						required: true,
						message: "请选是否接收充电桩故障短信",
						trigger: "change"
					}],
				},
				form2: {
					id: '',
					password: ''
				},
				rules2: {
					password: [{
						required: true,
						message: "登录密码不能为空",
						trigger: "blur"
					}],
				},
				resetPwdOpen: false
			};
		},
		created() {
			this.getRoleListForSearch();
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
				listOperatorUser(params).then(response => {
					this.userList = response.rows;
					this.total = response.total;
					this.loading = false;
				})
			},
			/** 搜索按钮操作 */
			handleQuery() {
				this.queryParams.page = 1;
				this.getList();
			},
			/** 重置按钮操作 */
			resetQuery() {
				this.dateRange = [];
				this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 查询角色列表 */
			getRoleListForSearch() {
				this.param = {
					page: 1,
					pageSize: 1000,
				}
				listRole(this.param).then(response => {
					this.searchRoleList = [];
					for (let i = 0; i < response.rows.length; i++) {
						this.searchRoleList.push(response.rows[i]);
					}
				});
			},
			/** 查询角色列表 */
			getRoleList() {
				this.param = {
					page: 1,
					pageSize: 1000,
				}
				listRole(this.param).then(response => {
					this.roleList = [];
					for (let i = 0; i < response.rows.length; i++) {

						this.roleList.push(response.rows[i]);

					}
				});
			},

			// 角色状态修改
			handleStatusChange(row) {
				let text = row.status == 0 ? "冻结" : "解冻";
				this.$modal.confirm('是否确认' + text + '用户"' + row.userName + '"？').then(function() {
					return changeUserStatus(row.id, row.status == 0 ? 1 : 0);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("修改成功");
				}).catch(function() {});
			},
			// 取消按钮
			cancel() {
				this.open = false;
				this.editOpen = false;
				this.reset();
			},
			// 表单重置
			reset() {
				this.form = {
					id: undefined,
					memberNum: undefined,
					leader: 0,
					cardId: undefined,
					checkInTime: undefined,
					deptId: undefined,
					userName: undefined,
					nickName: undefined,
					password: undefined,
					phonenumber: undefined,
					email: undefined,
					sex: undefined,
					status: "0",
					remark: undefined,
					roleIds: [],
					currentRole: '',
				};
				this.resetForm("form");
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.ids = selection.map(item => item.id)
				this.single = selection.length != 1
				this.multiple = !selection.length
			},

			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.getRoleList();
				this.editOpen = false;
				this.open = true;
				this.showTipsfont = true
				this.title = "添加操作员";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				this.editOpen = true;
				getUser(row.id).then(response => {
					if (response.data.roles) {
						response.data.currentRole = response.data.roles[0].roleId;
					}
					this.form = response.data;
					this.showTipsfont = false
					this.open = true;
					this.title = "修改操作员";
					this.getRoleList();
				});

			},

			/** 提交按钮 */
			submitForm: function() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						this.form.roleIds = [this.form.currentRole];
						let data = deepClone(this.form);
						if (data.id != undefined) {
							updateUser(data).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.open = false;
								this.editOpen = false;
								this.getList();
							});
						} else {
							addUser(data).then(response => {
								this.$modal.msgSuccess("新增成功");
								this.open = false;
								this.editOpen = false;
								this.getList();
							});
						}
					}
				});
			},

			/** 删除按钮操作 */
			handleDelete(row) {
				const ids = row.id || this.ids;
				this.$modal.confirm('是否确认删除用户"' + row.userName + '"？').then(function() {
					return delUser(ids);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("删除成功");
				}).catch(() => {});
			},

			statusUserConfig(data) {
				return data == 0 ? '正常' : '冻结';
			},
			statusUserColor(data) {
				if (data == '1') {
					return {
						"style": "color:red"
					};
				} else if (data == '0') {
					return {
						"style": "color:green"
					}
				}
				return {
					"style": ""
				}
			},
			warnReceiverColor(data) {
				if (data == '0') {
					return {
						"style": "color:red"
					};
				} else if (data == '1') {
					return {
						"style": "color:green"
					}
				}
				return {
					"style": ""
				}
			},
			selectAbled(row, index) {
				if (row.id == 1) {
					return false;
				} else {
					return true;
				}
			},
			handleResetPwd(row) {
				this.$modal.confirm('是否确认为用户"' + row.userName + '"初始化密码？初始密码为手机号码后8位').then(function() {
					return resetUserPwd(row.id);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("操作成功");
				}).catch(() => {});
			},
			cancelResetPwd() {
				this.form2 = {
					id: '',
					password: ''
				};
				this.resetPwdOpen = false;
			},
			submitResetPwd() {
				this.$refs["form2"].validate(valid => {
					if (valid) {
						resetUserPwd(this.form2.id, this.form2.password).then(response => {
							this.$modal.msgSuccess("修改成功");
							this.resetPwdOpen = false;
							this.getList();
						});

					}
				});
			},
		}
	};
</script>

<style scoped>
	.ps {
		color: #d9001b !important;
	}
</style>
