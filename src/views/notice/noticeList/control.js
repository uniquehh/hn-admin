// const cityOptions = [
//   "南部县桂景大道北延线项目",
//   "富顺县城乡冷链物流基础设施建设项目",
//   "古蔺县仙谭酒厂饶厂公路项目",
//   "二郎镇至太平镇财湾码头道路工程",
// ];

import request from "@/utils/request";
export default {
  components: {
    projectDetail: () => import("@/layout/components/ProjectDetail"),
  },
  name: "NoticeList",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 是否显示弹出层
      open: false,
      open2: false,
      // 总条数
      total: 10,
      //title
      title: "",
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        title: "",
        startDate: "",
        endDate: "",
        isAsc: "desc",
        orderBy: 't.createTime',
      },

      date: "",
      isEdit: false,

      //公告信息
      tableData: [],
      //项目信息
      projectData: [],

      checkAll: false,
      checkedCities: [], //已勾选的选项
      cities: [], //全部多选项数据
      isIndeterminate: false,

      //发布表格
      form: {
        title: "",
        projectIds: "",
        content: "",
      },

      detail: {},

      // 表单校验
      rules: {
        title: [
          {
            required: true,
            message: "请输入公告标题",
            trigger: "blur",
          },
        ],
        projectIds: [
          {
            required: true,
            message: "请至少选择一项发布项目",
            trigger: "blur",
          },
        ],
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    publish() {
      this.editOpen = true;
      this.open = true;

      this.reset();
      this.getProject();
      this.title = "发布公告";
    },

    // //获取项目
    getProject() {
      return request({
        url: "/system/project/getAll",
        method: "get",
        params: {},
      }).then((res) => {
        this.cities = res.data;
      });
    },

    //获取公告列表
    getList() {
      this.loading = true;
      return request({
        url: "/system/notice/queryList",
        method: "get",
        params: this.queryParams,
      }).then((res) => {
        // this.tableData.push(...res.rows);
        this.tableData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        title: "",
        projectIds: "",
        content: "",
      };
      this.checkAll = false;
      this.checkedCities = [];
      this.isIndeterminate = true;
      this.isEdit = false;
      this.resetForm("form");
    },

    /** 搜索按钮操作 */
    handleQuery() {
      if (this.date) {
        this.queryParams.startDate = this.date[0];
        this.queryParams.endDate = this.date[1];
      } else {
        this.queryParams.startDate = "";
        this.queryParams.endDate = "";
      }
      console.log(this.queryParams, "11111111");
      this.getList();
    },

    /** 修改按钮操作 */
    async handleUpdate(row) {
      this.reset();
      this.isEdit = true;
      await this.getProject();
      return request({
        url: `/system/notice/queryById/${row.id}`,
        method: "get",
      }).then((res) => {
        this.form = res.data;
        this.checkAll = res.data.projectIds=='0';
        this.open = true;
        if (res.data.projectIds == 0) {
          this.checkedCities = this.cities.map((item) => item.id);
        } else {
          let arr = res.data.projectIds.split(",");
          this.checkedCities = arr.map((item) => {
            return Number(item);
          });
        }
      });
    },

    handleView(row) {
      this.title = `（${row.title}）详情`;

      return request({
        url: `/system/notice/queryById/${row.id}`,
        method: "get",
      }).then((res) => {
        this.detail = res.data;
        this.open2 = true;
      });
    },

    //查看所属项目详情
    handleView2(row, index) {
      console.log(row, "rowwwwwwwww");
      this.$refs.projectDetailRef.init(row.projects[index].projectId);
    },

    cancel() {
      this.editOpen = false;
      this.open = false;
      this.reset();
    },

    //重置表单搜索
    resetQuery() {
      this.queryParams = {
        page: 1,
        pageSize: 10,
        title: "",
        startDate: "",
        endDate: "",
        isAsc: "desc",
		orderBy: 't.createTime',
      };
      this.date = [];
      this.getList();
    },

    /** 提交按钮 */
    submitForm: function () {
      let url = "";
      if (this.isEdit) {
        url = "/system/notice/update";
      } else {
        url = "/system/notice/create";
      }
      console.log(this.form, url, "formmmmm,urlllll");
      this.$refs["form"].validate((valid) => {
        console.log(valid);
        if (valid) {
          return request({
            url,
            method: "post",
            data: this.form,
          }).then((res) => {
            console.log(res);
            this.$modal.msgSuccess("发布成功");

            this.open = false;
            this.tableData = [];
            this.getList();
          });
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认标题为"' + row.title + '"的公告？')
        .then(function () {
          return request({
            url: "/system/notice/deleteByIds",
            method: "post",
            data: [row.id],
          });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    //全选项目
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities.map((item) => item.id) : [];
      console.log(val, this.checkedCities, "全选");
      //后台传参projectIds 为0表示全选
      if (this.checkedCities.length) {
        this.form.projectIds = "0";
      } else {
        this.form.projectIds = "";
      }

      this.isIndeterminate = false;
    },

    //选择项目
    handleCheckedCitiesChange(value) {
      console.log(value, "value");
      //选择id转为字符串，上传后台
      // let checkBox = value.map((item) => {
      //   return item.id;
      // });

      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;

      if (this.checkAll) {
        this.form.projectIds = 0;
      } else {
        this.form.projectIds = value.toString();
      }
      console.log(this.form.projectIds, "this.form.projectIds");
      console.log(this.checkAll, "checkAll");
    },
  },
};
