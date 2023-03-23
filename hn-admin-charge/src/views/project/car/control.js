import request from "@/utils/request";
import http from "@/utils/request";
import {
  getToken
} from '@/utils/auth'
import carinfo from "@/layout/components/carInfo/carInfo"
export default {
  components: {
    carinfo,
    //引入组件
    driverDetail: () => import("@/layout/components/DriverInfo/index"),
    projectDetail: () => import('@/layout/components/ProjectDetail'),
    constunctionDetail: () => import("@/layout/components/constunctionDetail"),
  },
  name: "Car",
  data() {
    return {
      // 是否显示弹出层
      open: false,
      // 弹出窗口标题
      title: "",
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
        projectId: '',
        constructionEnterpriseId: '',
        accessFlag: '',
        firstId: '',
        secondId: '',
        thirdId: '',
        typeValue: "",
        carType: [],
        orderBy: 't.create_time',
        isAsc: 'desc'
      },
      tableData: [],
      //所有项目
      projectList: [],
      //搜索用的    项目下的施工单位
      enterpriseSearchList: [],
      //添加编辑时用的 ，  项目下的施工单位
      enterpriseList: [],
      //设备分类 -  树形结构
      carType: [],
      props: {
        label: 'typeName',
        value: 'id',
        // checkStrictly: true,
        expandTrigger: 'hover'
      },
      //出场和离场数据
      accessFlagList: [{
        value: '1',
        label: '进场'
      }, {
        value: '2',
        label: '离场'
      }],

      uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',

      // 项目下的所有司机
      drivers: [],
      checkAll: false,
      //选中的司机数据
      driverIds: [],
      // dialog数据
      form: {
        title: "",
        imageUrl: "",
        code: "",
        name: "",
        projectId: '',
        constructionEnterpriseId: '',
        firstId: '',
        secondId: '',
        thirdId: '',
        typeValue: "",
        carType: [],
      },
      // 所属分类的选项配置
      typeProps: {
        value: "id",
        label: "typeName"
      },

      // 弹窗表单校验规则
      rules: {
        imageUrl: [{
          required: true,
          message: '必须上传图片',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '设备编码必填',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '设备名称必填',
          trigger: 'blur'
        }],
        typeValue: [{
          required: true,
          message: '所属分类必填',
          trigger: 'blur'
        }],
        projectId: [{
          required: true,
          message: '所属项目必填',
          trigger: 'blur'
        }],
        constructionEnterpriseId: [{
          required: true,
          message: '所属施工单位必填',
          trigger: 'blur'
        }],
        checkedDriver: [{
          required: true,
          message: '请绑定作业司机',
          trigger: 'blur'
        }],
      },
      // 上传图片--请求头
      uploadHeaders: {
        PLATFORM: 'pc',
        token: getToken()
      },
    };
  },
  created() {
    this.getProjectAll();
    this.getAllCarType();
    this.getList();
  },
  methods: {
    handleCheckAll(val) {
      this.driverIds = [];
      if (this.checkAll == true) {
        let driverIds = [];
        this.drivers.forEach(driver => {
          driverIds.push(driver.id);
        })
        this.driverIds = driverIds;
      }
    },
    handleCheck(val) {
      this.checkAll = this.driverIds.length == this.drivers.length;
    },
    viewProject(row) {
      this.$refs.projectDetail.init(row.projectId);
    },
    viewConstunction(row) {
      return request({
        url: `/system/constructionEnterprise/queryById/${row.constructionEnterpriseId}`,
        method: "get",
      }).then((res) => {
        this.$refs.constunctionDetail.open(res.data);
      });

    },
    viewDriver(driverId) {
      this.$refs.driverDetail.getDinfo(driverId);
    },
    // 获取所有项目信息
    getProjectAll() {
      http.get("system/project/getAll").then((res) => {
        this.projectList = res.data || [];
      })
    },
    getAllCarType() {
      http.get('/system/carType/queryList').then(res => {
        let carType = res.data || [];
        if (carType.length > 0) {
          carType.forEach((first) => {
            first.children.forEach((second) => {
              second.children.forEach((third) => {
                delete third.children
              })
            })
          })
        }
        this.carType = carType;
      });
    },
    getEnterpriseByProjectId(projectId, callback) {
      http.get('/system/constructionEnterprise/queryAllByProjectId/' + projectId).then(callback);
    },
    changeSearchProject(id) {
      this.enterpriseSearchList = [];
      this.queryParams.constructionEnterpriseId = "";
      if (id && id > 0) {
        this.queryParams.projectId = id;
        this.getEnterpriseByProjectId(id, res => {
          this.enterpriseSearchList = res.data || [];
        })
      }
    },
    selectProject(id) {
      this.enterpriseList = [];
      this.form.constructionEnterpriseId = "";
      this.drivers = [];
      this.driverIds.length = 0;
      this.checkAll = false;
      this.form.checkedDriver = [];
      if (id && id > 0) {
        this.form.projectId = id;
        this.getEnterpriseByProjectId(id, res => {
          this.enterpriseList = res.data || [];
        })
        this.getDriverByProjectId(id);
      }
    },
    selectEnterprise(id) {
      if (id && id > 0) {
        this.form.constructionEnterpriseId = id;
      }
    },
    changeSearchCarType(carTypeIds) {
      this.queryParams.firstId = '';
      this.queryParams.secondId = '';
      this.queryParams.thirdId = '';
      if (carTypeIds && carTypeIds.length > 0) {
        this.queryParams.firstId = carTypeIds[0]
        if (carTypeIds.length > 1) {
          this.queryParams.secondId = carTypeIds[1];
        }
        if (carTypeIds.length > 2) {
          this.queryParams.thirdId = carTypeIds[2];
        }
      }
    },
    changeCarType(carTypeIds) {
      this.form.firstId = '';
      this.form.secondId = '';
      this.form.thirdId = '';
      this.form.typeValue = '';
      this.form.carType=[];

      if (carTypeIds && carTypeIds.length > 0) {
        this.form.firstId = carTypeIds[0]
        if (carTypeIds.length > 1) {
          this.form.secondId = carTypeIds[1];
        }
        if (carTypeIds.length > 2) {
          this.form.thirdId = carTypeIds[2];
          this.form.typeValue = carTypeIds.join(',');
        }
      }
      this.form.carType = carTypeIds;
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
        projectId: '',
        constructionEnterpriseId: '',
        accessFlag: '',
        firstId: '',
        secondId: '',
        thirdId: '',
        typeValue: "",
        carType: [],
        orderBy: 't.create_time',
        isAsc: 'desc'
      }
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getList() {
      this.loading = true;
      let that = this;
      http.request({
        url: '/system/car/queryList',
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

    // 打开车辆详情子组件
    getCarInfo_Child(scope) {
      this.carInfoCom = true
      this.$refs.opencarinfo.openCarIndoDialog(scope.row.id)
    },
    // 获取车辆详情信息
    getCarInfo(id) {
      return request({
        url: `system/car/queryById/${id}`,
        method: "GET",
        params: {}
      })
    },

    // 获取项目下的司机
    getDriverByProjectId(projectId) {
      http.get("/system/driver/queryAllByProjectId/" + projectId).then(res => {
        this.drivers = res.data || [];
      });
    },
		getDriverByProjectId2(projectId) {
			return new Promise((reslove) => {
				http.get("/system/driver/queryAllByProjectId/" + projectId).then(res => {
					reslove(res.data)
				});
			})
    },
    //进场/离场
    updateAccessFlag(row) {
      let that = this;
      let title = row.accessFlag == 2 ? "您确认要让本车辆进场吗？" : "您确认要让本车辆离场吗？";
      this.$modal.confirm(title).then(function() {
        return http.request({
          url: '/system/car/updateAccessFlag/' + row.id,
          method: 'get'
        })
      }).then(() => {
        this.$modal.msgSuccess('操作成功');
        this.getList()
      }).catch(() => {

      })
    },
    // 图片上传成功
    uploadImgSuccess(res) {
      this.form.imageUrl = res.data
      this.$refs.uploadImg.clearFiles()
    },
    // 编辑或添加
    async handleUpdata(type, scope) {
      this.form = {
        title: "",
        imageUrl: "",
        code: "",
        name: "",
        projectId: '',
        constructionEnterpriseId: '',
        firstId: '',
        secondId: '',
        thirdId: '',
        typeValue: "",
        carType: [],
        driverIds: [],
      };
			this.drivers = [];
      this.driverIds.length = 0;
      this.checkAll = false;
      this.open = true;
      if (type == "添加") {
        // dialogData数据重置
        this.form.title = "添加车辆设备";
      } else {
        this.form.title = "编辑车辆设备";
        this.getEnterpriseByProjectId(scope.row.projectId, res => {
          this.enterpriseList = res.data || [];
        })
        // 获取项目下的司机数据
				this.drivers = await this.getDriverByProjectId2(scope.row.projectId) || [];
				// this.getDriverByProjectId(scope.row.projectId)
				console.log(this.drivers);
        this.getCarInfo(scope.row.id).then((res) => {
          res.data.carType = [res.data.firstId, res.data.secondId, res.data.thirdId];
          this.form = res.data;
          this.form.typeValue = this.form.carType.join(',');
          let currentDrivers = res.data.drivers || [];
          if (currentDrivers.length > 0) {
            currentDrivers.forEach(driver => {
              this.driverIds.push(driver.driverId);
            })
          }
					this.checkAll = this.driverIds.length == this.drivers.length;
					console.log(this.drivers);
        })
      }
    },

    cancel() {
      this.open = false;
    },

    /** 添加\修改车辆信息 */
    submitForm() {
      this.$refs.form.validate((valid) => {
				if (valid) {
					this.$confirm('您确定要提交当前操作吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
						let params = this.form;
						params.driverIds = this.driverIds;
						if (this.form.id && this.form.id > 0) {
							// 修改设备请求
							request({
								url: "system/car/update",
								method: "POST",
								data: params
							}).then((res) => {
								this.open = false;
								this.getList();
							})
						} else {
							// 添加设备请求
							request({
								url: "system/car/create",
								method: "POST",
								data: params
							}).then((res) => {
								this.open = false;
								console.log(res, "添加设备成功");
								this.queryParams.page = 1;
								this.getList();
							})
						}
          })
        } else {
          return false;
        }
      });
    },
  },
};
