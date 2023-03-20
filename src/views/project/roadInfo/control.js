import http from '@/utils/request'
export default {
  components: {
    roadDetail: () => import("@/layout/components/RoadDetail")
  },
	name: "RoadInfo",
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 总条数
      total: 0,
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
        roleKey: undefined,
        status: undefined,
        orderBy: 'createTime',
        isAsc: 'desc'
      },
      tableData: [],
      form: {
        name: "",
        remark: "",
      },
      rules: {
        name: [{
          required: true,
          message: "道路名称不能为空",
          trigger: "blur"
        }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleView(row) {
      this.$refs.roadDetailRef.init(row.id);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      // this.resetForm("queryForm");
      this.queryParams.page = 1;
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      let that = this;
      http.request({
        url: '/system/road/queryList',
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
        name: '',
        remark: "",
      };
      this.resetForm("form");
    },
    handleCreate() {
      this.editOpen = false;
      this.open = true;
      this.title = "添加道路信息";
      this.reset();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.editOpen = true;
      this.open = true;
      this.title = "编辑道路信息";
      http.request({
        url: '/system/road/queryById/' + row.id,
        method: 'get'
      }).then(response => {
        this.form = response.data;
        this.open = true;
      })
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
            http.post('/system/road/create', data).then(res => {
              that.$modal.msgSuccess("道路信息添加成功");
              that.open = false;
              that.getList();
            });
          } else {
            http.post('/system/road/update', data).then(res => {
              that.$modal.msgSuccess("道路信息更新成功");
              that.open = false;
              that.getList();
            });
          }
        }
      })

    },

    /** 删除按钮操作 */
    handleDelete(row) {
      let ids = row.id
      let that = this;
      if (ids) {
        ids = [ids]
      } else {
        ids = this.ids;
      }
      this.$modal.confirm('是否确认删除道路为"' + row.name + '"的信息？').then(function() {
        return http.request({
          url: '/system/road/deleteByIds',
          method: 'post',
          data: ids
        })
      }).then(() => {
        if (that.total % that.queryParams.pageSize == 1) {
          if (that.queryParams.page <= 2) {
            that.queryParams.page = 1;
          } else {
            that.queryParams.page -= 1;
          }
        }
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {})
    }
  }
};
