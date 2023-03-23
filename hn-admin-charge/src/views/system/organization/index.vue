<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col class="el-calendar__title">
          <label class="title">数据筛选</label>
        </el-col>
        <el-col>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 120px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 180px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        </el-col>
    </el-row>
    <el-divider/>
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="7" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
          >
            <span class="custom-tree-node" style="display:flex;justify-content: space-between;width:100%;" slot-scope="{node,data}" >
              <span @click="handleNodeClick(data)">{{node.label}}</span>
              <span>
                <el-button size="mini" type="text" v-if="node.level!=3"  v-on:click="handleAddDept(node)">添加</el-button>
                <el-button size="mini" type="text" v-on:click="handleDeptUpdate(node)">编辑</el-button>
                <el-button size="mini" type="text" v-if="node.childNodes.length==0"  v-on:click="handleDeptDelete(node)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <!--用户数据--> <!--  :render-content="renderContent" -->
      <el-col :span="17" :xs="24">


        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"

              icon="el-icon-plus"
              size="mini"
              @click="addCompany"
              v-hasPermi="['system:user:add']"
            >添加公司</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >新增员工</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="resetPwd"
              v-hasPermi="['system:user:resetPwd']"
            >重置密码</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="changeUserStatus(1)"
              v-hasPermi="['system:user:edit']"
            >冻结</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="changeUserStatus(0)"
              v-hasPermi="['system:user:edit']"
            >解冻</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
            >导入员工</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['system:user:export']"
            >导出excel</el-button>
          </el-col>
        <!--  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>-->
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="工号" align="center" prop="memberNum" />
          <el-table-column label="姓名" align="center"  prop="userName"  :show-overflow-tooltip="true" />
          <el-table-column label="联系电话" align="center"  prop="phonenumber"  :show-overflow-tooltip="true" />
          <el-table-column label="身份证号" align="center"  prop="cardId" :show-overflow-tooltip="true" />
          <el-table-column label="部门名称" align="center" prop="dept.parentName" width="120" />
          <el-table-column label="岗位名称" align="center"  prop="dept.deptName" width="120" />
          <el-table-column label="是否部门负责人" align="center"   prop="leader" width="120">
            <template slot-scope="scope">
              <span>{{ memberLeader(scope.row.leader) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" width="120" >
            <template slot-scope="scope">
              <span>{{ statusUserConfig(scope.row.status) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="入职时间" align="center" prop="checkInTime"  width="160">
           <template slot-scope="scope">
              <span>{{ parseTime(scope.row.checkInTime,'{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:user:edit']"
              >修改</el-button>
              <el-button
              v-if="scope.row.status == 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="changeUserStatus(1,scope.row)"
              v-hasPermi="['system:user:edit']"
            >冻结</el-button>
              <el-button
                v-if="scope.row.status == 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="changeUserStatus(0,scope.row)"
                v-hasPermi="['system:user:edit']"
              >解冻</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->


    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-error="handleFileError"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
         <!-- <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
          </div>-->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <add-member :title="title" :addMemberOpen.sync="open" v-on:afterAdd="getList" :userId="userId"/>
    <add-company :title="companyTitle" :addCompanySwitch.sync="companyOpen" :deptId="editDeptId"  v-on:afterAdd="getTreeselect"/>
    <add-dept :title="deptTitle" :addDeptOpen.sync="deptOpen" :parent="deptParentId"  :deptId="editDeptId" v-on:afterAdd="getTreeselect" :level="deptLevel"/>
  </div>
</template>

<script>
  import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus,resetBatchUserPwd,changeBatchUserStatus } from "@/api/system/user";
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";

  import { getToken } from "@/utils/auth";
  import { treeselect } from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import AddCompany from "./plugin/addCompany";
  import AddDept from "./plugin/addDept";
  import AddMember from "./plugin/addMember";

  export default {
    name: "User",
    dicts: ['sys_normal_disable', 'sys_user_sex'],
    components: {AddMember, AddDept, AddCompany, Treeselect },
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
        // 用户表格数据
        userList: null,
        companyOpen:false,
        companyTitle:'',
        // 弹出层标题
        title: "",
        deptTitle:"",
        deptOpen:false,
        deptLevel:0,
        deptParentId:'',
        editDeptId:'',
        userId:'',

        // 部门树选项
        deptOptions: undefined,
        // 是否显示弹出层
        open: false,
        // 部门名称
        deptName: undefined,
        // 默认密码
        initPassword: undefined,
        // 日期范围
        dateRange: [],
        // 岗位选项
        postOptions: [],
        // 角色选项
        roleOptions: [],
        // 表单参数
        form: {},
        defaultProps: {
          children: "children",
          label: "label"
        },
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/system/user/importData"
        },
        // 查询参数
        queryParams: {
          page: 1,
          pageSize: 10,
          userName: undefined,
          phonenumber: undefined,
          status: undefined,
          deptId: undefined
        },
        // 列信息
        columns: [
          { key: 0, label: `用户编号`, visible: true },
          { key: 1, label: `用户名称`, visible: true },
          { key: 2, label: `用户昵称`, visible: true },
          { key: 3, label: `部门`, visible: true },
          { key: 4, label: `手机号码`, visible: true },
          { key: 5, label: `状态`, visible: true },
          { key: 6, label: `创建时间`, visible: true }
        ],
        // 表单校验

      };
    },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
      this.getList();
      this.getTreeselect();
      this.getConfigKey("sys.user.initPassword").then(response => {
        this.initPassword = response.msg;
      });
    },
    methods: {
      memberLeader(data){
        return data==0?'否':'是'
      },
      statusUserConfig(data){
        return data==0?'正常':'冻结'
      },
      /** 重置密码按钮操作 */
      resetPwd() {
        this.$prompt('请输入新密码', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputPattern: /^.{5,20}$/,
          inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
        }).then(({ value }) => {
          resetBatchUserPwd(this.ids, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
      },
      changeUserStatus(status,row){
        const ids = (row&&[row.userId]) || this.ids;
        this.$modal.confirm('是否确认'+(status==0?'解冻':'冻结')+'该员工账号？').then(function() {
          return changeBatchUserStatus(ids,status);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("修改成功");
        }).catch(() => {});
      },
      /** 删除按钮操作 */
      handleDeptDelete(node) {
        this.$modal.confirm('是否确认删除名称为"' + node.data.label + '"的数据项？').then(function() {
          return delDept(node.data.id);
        }).then(() => {
          this.getTreeselect();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 添加公司*/
      addCompany(){
        this.companyTitle="添加公司";
        this.companyOpen = true;
      },
      handleAddDept(node){
        this.deptTitle="添加"+(node.level==2?"部门":"岗位");
        this.deptOpen =true
        this.deptLevel = node.level;
        this.deptParentId = node.data.id
      },
      handleDeptUpdate(node){
        if (node.level==1){
          this.companyTitle="编辑公司";
          this.companyOpen = true;
          this.editDeptId = node.data.id
        } else{
          this.deptTitle="编辑"+(node.level==2?"部门":"岗位");
          this.deptOpen =true
          this.deptLevel = node.level;
          this.editDeptId = node.data.id
        }

      },
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.userList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      /** 查询部门下拉树结构 */
      getTreeselect() {
        this.editDeptId=undefined;
        this.deptParentId=undefined;
        treeselect().then(response => {
          this.deptOptions = response.data;
        });
      },
      // 筛选节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        this.queryParams.deptId = data.id;
        this.handleQuery();
      },
      // 用户状态修改
      handleStatusChange(row) {
        let text = row.status === "0" ? "启用" : "停用";
        this.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗？').then(function() {
          return changeUserStatus(row.userId, row.status);
        }).then(() => {
          this.$modal.msgSuccess(text + "成功");
        }).catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
      },
      // 表单重置

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
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.userId);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      // 更多操作触发
      handleCommand(command, row) {
        switch (command) {
          case "handleResetPwd":
            this.handleResetPwd(row);
            break;
          case "handleAuthRole":
            this.handleAuthRole(row);
            break;
          default:
            break;
        }
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.getTreeselect();
        getUser().then(response => {
          this.postOptions = response.posts;
          this.roleOptions = response.roles;
          this.open = true;
          this.userId="";
          this.title = "添加用户";
          this.form.password = this.initPassword;
        });
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        //this.getTreeselect();
        const userId = row.userId || this.ids;
        this.userId = userId;
        this.open = true;
        this.title = "修改用户";
      /*  getUser(userId).then(response => {
          this.form = response.data;
          this.postOptions = response.posts;
          this.roleOptions = response.roles;
          this.form.postIds = response.postIds;
          this.form.roleIds = response.roleIds;

          this.form.password = "";
        });*/
      },
      /** 重置密码按钮操作 */
      handleResetPwd(row) {
        this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          closeOnClickModal: false,
          inputPattern: /^.{5,20}$/,
          inputErrorMessage: "用户密码长度必须介于 5 和 20 之间"
        }).then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        }).catch(() => {});
      },
      /** 分配角色操作 */
      handleAuthRole: function(row) {
        const userId = row.userId;
        this.$router.push("/system/user-auth/role/" + userId);
      },
      /** 提交按钮 */
      submitForm: function() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.userId != undefined) {
              updateUser(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addUser(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const userIds = row.userId || this.ids;
        this.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/user/export', {
          ...this.queryParams
        }, `user_${new Date().getTime()}.xlsx`)
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "用户导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('system/user/importTemplate', {
        }, `user_template_${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
      },
      handleFileError(err,file,fileList){
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        let error = JSON.parse(err.message);
        this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + error.message + "</div>", "导入结果",
          { dangerouslyUseHTMLString: true });
      }
    }
  };
</script>
<style scoped lang="scss">
    .el-calendar__title {
      padding:0px 10px 10px 10px;
      .title{
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 700;
          color: #56585c;
      }
    }
  .el-divider--horizontal{
    margin:0px 0px 24px 0!important;
  }
</style>
