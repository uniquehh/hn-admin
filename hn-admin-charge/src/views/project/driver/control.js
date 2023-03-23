// const cityOptions = [
//   "南部县桂景大道北延线项目",
//   "富顺县城乡冷链物流基础设施建设项目",
//   "古蔺县仙谭酒厂饶厂公路项目",
//   "二郎镇至太平镇财湾码头道路工程",
// ];
import { getProject, getDriverList, getListOneInfo, updataListOneInfo, addListOneInfo, freezeThaw, resetPassword } from '@/api/driverManagement/driver'
import { getToken } from '@/utils/auth'
import Dirver from "@/layout/components/DriverInfo/index";
export default {
	name: "Driver",
  data() {
    return {
	// 遮罩层
			loading: true,
      // 是否显示弹出层
      open: false,
      // 总条数
      total: null,
      //title
      title: "",
      // dialog提示语
      showTipsfont: true,
      // 查询参数
      queryParams: {
        page: 1,
        pageSize: 10,
        keyword: "",
        projectId: "",
        isAsc: "desc",
        orderBy: "t.create_time"
      },
      tableData: [],

      //公司下拉选项
      options: [],

      // 性别选项
      options2: [
        {
          value: 0,
          label: "男",
        },

        {
          value: 1,
          label: "女",
        },
      ],

      value: "",

      form: {
        headImage: '',
        name: '',
        phone: '',
        age: '',
        sex: '',
        projectId: ''
      },

      rules: {
        headImage: [{
          required: true,
          message: "请上传头像",
          trigger: "change"
        }],
        name: [{
          required: true,
          message: "请输入司机名称",
          trigger: "blur"
        }],
        phone: [{
          required: true,
          message: "请输入司机手机号",
          trigger: "blur"
        }],
        age: [{
          required: true,
          message: "请选择司机年龄",
          trigger: "blur"
        }],
        sex: [{
          required: true,
          message: "请选择司机性别",
          trigger: "change"
        }],
        projectId: [{
          required: true,
          message: "请选择司机所属项目",
          trigger: "change"
        }],
      },

      uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',

      uploadHeaders: {
        PLATFORM: 'pc',
        token: getToken()
      }
    };
  },
  components: {
    Dirver,
  },
 
  created() {
    this.projectAll()
    this.driverList()
  },

  methods: {
    dirverDetail(row){
      this.$refs.dInfo.getDinfo(row.data11)
    },

    /* 所有项目 */
    projectAll() {
      // 获取公司
      getProject().then(res => {
        res.data.forEach((item) => {
          this.options.push({
            value: item.id,
            label: item.projectName
          })
        })
      })
    },

    /* 获取司机列表 */
    driverList() {
      // 司机列表
			this.loading = true;
      getDriverList(this.queryParams).then(res => {
				this.loading = false;
        if (res.code == 1) {
          this.tableData = []
          res.rows.forEach((item) => {
            this.tableData.push({
              data1: item.name,
              data2: item.phone,
              data3: item.projectCode,
              data4: item.projectName,
              data5: item.age,
              data6: (item.sex ? '女' : '男'),
              data7: item.deviceAmount,
              data8: (item.chargingCapacity ? item.chargingCapacity : 0),
              data9: (item.chargingPrice ? item.chargingPrice : 0),
              data10: item.status,
              data11: item.id,
              data12: item.headImage,
              data13: (item.status ? '冻结' : '正常')
            })
          })
          console.log(this.tableData, '[][][]--=-=-=')
          this.total = res.total
        }
      }).catch(() => {
				this.loading = false;
			})
    },

    // 表单重置
    reset() {
      this.form = {
        headImage: '',
        name: '',
        phone: '',
        age: '',
        sex: '',
        projectId: ''
      }
      if (this.$refs.form !== undefined) {
        this.$refs.form.resetFields()
      }
    },

    /** 修改按钮操作 */
    handleUpdata(row) {
      this.editOpen = true;
      this.open = true;
      this.showTipsfont = false
      this.title = "修改信息";
      this.reset();
      getListOneInfo(row.data11).then(res => {
        if (res.data.age == '') {
          res.data.age = 0
        }
        this.form = res.data
      })
    },
    /* 增加按钮操作 */
    handleAdd() {
      this.editOpen = true;
      this.open = true;
      this.showTipsfont = true
      this.title = "添加司机";
      this.reset();
    },

    /* 取消按钮 */
    cancel() {
      this.editOpen = false;
      this.open = false;
      this.reset();
    },

    /** 提交按钮 */
    submitForm() {
      console.log(this.form, '[][][][][')
      this.$refs["form"].validate((valid) => {
        console.log(valid, '[][][]()_+_+_+')

        if (valid) {
          // 修改
          if (this.showTipsfont == false) {
            let pars = {
              age: this.form.age,
              id: this.form.id,
              name: this.form.name,
              phone: this.form.phone,
              projectId: this.form.projectId,
              sex: this.form.sex,
              status: this.form.status,
              headImage: this.form.headImage
            }
            console.log(pars, '[[[[[]]]]')
            updataListOneInfo(pars).then(res => {
              if (res.code == 1) {
                this.editOpen = false;
                this.open = false;
                this.driverList()
              }
            })
          } else {
            // 添加
            console.log(this.form, '[][][')
            let addpars = {
              name: this.form.name,
              phone: this.form.phone,
              projectId: this.form.projectId,
              age: this.form.age,
              sex: this.form.sex,
              headImage: this.form.headImage,
              status: 0
            }
            addListOneInfo(addpars).then(res => {
              if (res.code == 1) {
                this.editOpen = false;
                this.open = false;
                this.driverList()
              }
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    /* 冻结按钮 */
    freezeUsers(row) {
      console.log(row.data10, '[][]')
      console.log(row.data13, '[][]')
      let statusfont = row.data10 ? '解冻' : '冻结'
      this.$confirm(`是否${statusfont}该账户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        freezeThaw(row.data11).then(res => {
          if (res.code == 1) {
            this.$message({
              type: 'success',
              message: `${statusfont}成功!`
            });
            this.driverList()
          } else {
            this.$message.error(`${statusfont}失败!`)
          }
        })
      }).catch(() => {

      });
    },

    /* 重置密码 */
    resetPwd(row) {
      this.$confirm('是否重置该账户密码并重设手机号后八位为默认密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(row.data11).then(res => {
          if (res.code == 1) {
            this.$message({
              type: 'success',
              message: '重置成功!'
            });
          } else {
            this.$message.error('重置失败')
          }
        })
      }).catch(() => {

      });
    },

    /* 搜索 */
    searchDrive() {
      this.queryParams.page = 1
      this.queryParams.pageSize = 10
      this.queryParams.projectId = this.value
      this.driverList()
    },

    /* 上传头像 */
    handleImageUrlSuccess(response, file, fileList) {
      this.form.headImage = response.data
      this.$forceUpdate()
      console.log(this.$refs.upload)
      this.$refs['upload'].clearFiles();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        page: 1,
        pageSize: 10,
        keyword: "",
        projectId: "",
        isAsc: "desc",
        orderBy: "t.create_time"
      },
      this.value = ''
      this.driverList()
    },
  },
};
