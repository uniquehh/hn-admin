import http from '@/utils/request'
export default {
  components: {
    //引入组件
    projectDetail: () => import('@/layout/components/ProjectDetail'),
    roadDetail: () => import("@/layout/components/RoadDetail"),
    enterprise: () => import('@/layout/components/EnterpriseDetail')
  },
	name: "ProjectMannage",
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value == '') {
        callback();
      }
      if (!/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确的电话号码'));
      } else {
        callback();
      }
    };
    return {
      // 是否显示弹出层
      open: false,
      open2: false,
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
        enterpriseId: '',
        roadId: '',
        startDate: '',
        endDate: '',
        roleKey: undefined,
        status: undefined,
        orderBy: 'createTime',
        isAsc: 'desc'
      },
      tableData: [],
      //所有的企业信息
      roadList: [],
      //所有公司信息
      enterpriseList: [],

      //所有的企业信息
      roadSearchList: [],
      //所有公司信息
      enterpriseSearchList: [],
      value: "",
      value1: "",

      value2: "",

      form: {
        "address": "",
        "code": "",
        "contactName": "",
        "contactPhone": "",
        "description": "",
        "enterpriseId": '',
        "name": "",
        "roadId": '',
        "settleDay": 1
      },
      detail: {
        // 要查看的用户
        id: null,
        // 弹出层标题
        title: "查看项目详情",
        // 是否显示弹出层
        dialogShow: false,
      },
      rules: {
        code: [{
          required: true,
          message: "项目编码不能为空",
          trigger: "blur"
        }],
        name: [{
          required: true,
          message: "项目名称不能为空",
          trigger: "blur"
        }],
        contactName: [{
          required: true,
          message: "项目负责人不能为空",
          trigger: "blur"
        }],
        contactPhone: [{
            required: true,
            message: "负责人电话不能为空",
            trigger: "blur"
          },
          {
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        address: [{
          required: true,
          message: "工程建设地址不能为空",
          trigger: "blur"
        }],
        enterpriseId: [{
          required: true,
          message: "请选择所属公司",
          trigger: "blur"
        }],
        roadId: [{
          required: true,
          message: "请选择所属道路",
          trigger: "blur"
        }],
        settleDay: [{
          required: true,
          message: "账单日不能为空",
          trigger: "blur"
        }]
      },
    };
  },
  created() {
    this.getList();
    this.getAllRoad();
    this.getAllEnterprise();
  },
  methods: {
    handleViewRoad(row) {
      this.$refs.roadDetailRef.init(row.roadId);
    },
    handleViewCompany(row) {
      this.$refs.companyDetailRef.init(row.enterpriseId);
    },
    handleView(row) {
      this.$refs.projectDetailRef.init(row.id);
    },
    getAllRoad() {
      let that = this;
      http.request({
        url: '/system/road/getAll',
        method: 'get'
      }).then((res) => {
        that.roadList = res.data;
        that.roadSearchList = that.roadSearchList.concat(res.data);
      })
    },
    getAllEnterprise() {
      let that = this;
      http.request({
        url: '/system/enterprise/getAll',
        method: 'get'
      }).then((res) => {
        that.enterpriseList = res.data;
        that.enterpriseSearchList = that.enterpriseSearchList.concat(res.data);
      })
    },
    changeSelectEnterprise(id) {
      this.queryParams.enterpriseId = id;
    },
    changeSelectRoad(id) {
      this.queryParams.roadId = id;
    },
    selectSearchDateRange(date) {
      this.queryParams.startDate = date[0];
      this.queryParams.endDate = date[1];
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        pageSize: 10,
        keyword: "",
        enterpriseId: '',
        roadId: '',
        startDate: '',
        endDate: '',
        roleKey: undefined,
        status: undefined,
        orderBy: 'createTime',
        isAsc: 'desc'
      }
      this.value2="";
      this.resetForm("queryForm");
      this.handleQuery();
    },

    getList() {
      this.loading = true;
      let that = this;
      http.request({
        url: '/system/project/queryList',
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
    // 表单重置
    reset() {
      this.form = {
        "address": "",
        "code": "",
        "contactName": "",
        "contactPhone": "",
        "description": "",
        "enterpriseId": '',
        "name": "",
        "roadId": '',
        "settleDay": 1
      };
      this.resetForm("form");
    },
    handleCreate() {
      this.editOpen = false;
      this.open = true;
      this.title = "添加项目信息";
      this.reset();
    },


    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.editOpen = true;
      this.title = "编辑项目信息";
      http.request({
        url: '/system/project/queryById/' + row.id,
        method: 'get'
      }).then(response => {
        this.form = response.data;
        this.open = true;
      })
    },

    // 重置密码为手机号后8位
    handleResetPassword(row) {
      let that = this;
      this.$modal.confirm('确认重置项目负责人"' + row.contactName + '"的登录密码为手机号后8位？').then(function() {
        return http.request({
          url: '/system/project/resetPassword',
          method: 'post',
          data: {
            id: row.id
          }
        })
      }).then(() => {
        this.$modal.msgSuccess('密码重置成功')
      }).catch(() => {})
    },

    cancel() {
      this.editOpen = false;
      this.open = false;
      this.reset();
    },

    /** 提交按钮 */
    submitForm: function() {
      let that = this,
        data = this.form;
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!data.id || data.id <= 0) {
            http.post('/system/project/create', data).then(res => {
              that.$modal.msgSuccess("项目信息发布成功");
              that.open = false;
              that.getList();
            });
          } else {
            http.post('/system/project/update', data).then(res => {
              that.$modal.msgSuccess("项目信息更新成功");
              that.open = false;
              that.getList();
            });
          }
        }
      })
    },
  },
};
