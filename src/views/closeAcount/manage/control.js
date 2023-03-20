import request from "@/utils/request";
import getNextMonth from "@/vendor/timeObj.js";
import { getToken } from '@/utils/auth'
import Cookies from 'js-cookie'
import modal from "@/plugins/modal.js"
export default {
    name: "Manage",
  data() {
    return {
			// 遮罩层
			loading: true,
      // 明细清单表格数据
      mxTable:[],
      // 操作弹窗的表现控制
      dialogControl:{
        showCaoZuo:false,
        showJSinfo:false,
        showMingXi:false,
        dlogTitle1:"",
        dlogTitle2:"",
        jsStatus:"",
        width:"860px"
      },
      // 弹窗公共数据
      publicData:{
        day:"",
        endDate:"",
        month:"",
        projectCode:"",
        projectContactName:"",
        projectContactPhone:"",
        projectName:"",
        settleName:"",
        startDate:"",
        totalCharge:"",
        settlePrice: "",
        settleTime: "",
        status:"",
        remark:"",
        images:'',
      },
      // 结算操作弹窗的数据
      jsCaoZuo: {
        userName: Cookies.get("username"),
        beiZhu: "",
        imgs: [],
        files:[]
      },
      // 结算详情弹窗数据
      jsInfoData:{},
      // 结算清单弹窗数据
      jsQingDan:{},
      dialogVisible: false,
      // 结算操作弹窗显示隐藏
      showSeOp:false,
      // 是否显示弹出层
      open: false,
      // 结算管理表格总条数
      total: 0,
      // 明细清单表格分页器
      mxTablePagina: {
        total: 0,
        page: 1,
        pageSizes: [4,6,8],
        pageSize: 4,
      },
      settTablePagina: {
        total: 0,
        page: 1,
        pageSizes: [10,20,30,40],
        pageSize: 10,
      },
      //title
      title: "",
      tableData: [],
      //查询表单数据
      formData:{
        keyword:null,
        enterpriseId:null,
        roadId:null,
        month:null,
        status: null,
      },
      // 所属公司
      options1: [],
      // 所属道路
      options2: [],
      // 结算状态
      options4: [
        {
          value: 0,
          label: "未出账",
        },
        {
          value: 1,
          label: "待结算",
        },
        {
          value: 2,
          label: "已结算",
        },
      ],
      // 上传图片--请求头
      uploadHeaders: {
				PLATFORM: 'pc',
				token: getToken()
      },
      // 结算id
      settlementId: "",
      // 累计已结算金额
      settled:0,
      // 累计未结算金额
      unsettled: 0,
      // 图片上传地址
      uploadFileUrl: process.env.VUE_APP_BASE_API + '/upload/image/upload',
      rules: {
        beiZhu: [
          { required: true, message: '必须填写备注', trigger: 'blur' },
        ]
      }
    };
  },
  created() {
    this.getTableData()
    this.getCompany()
    this.getRoadData()
    this.getSumPrice()
  },
  methods: {
    // 重置搜索表单
    resetQuery() {
      this.formData = {
        keyword: null,
        enterpriseId: null,
        roadId: null,
        month: null,
        status: null,
      };
      // 重置后自动请求数据
      this.getTableData(this.formData)
      // 获取累计结算、未结算金额
      this.getSumPrice(this.formData)
    },
    // 明细清单表格分页
    mxPageSizeChange(ps) {
      this.mxTablePagina.pageSize = ps
      this.getMxTableData({
        settlementId: this.currentSettlementId,
        page:this.mxTablePagina.page,
        pageSize:ps,
      })
    },
    mxPageChange(pg) {
      this.mxTablePagina.page = pg
      this.getMxTableData({
        settlementId: this.currentSettlementId,
        page:pg,
        pageSize:this.mxTablePagina.pageSize,
      })
    },
    // 结算管理表格分页
    settPageSizeChange(ps) {
      this.settTablePagina.pageSize = ps
      this.getTableData(this.formData)
      this.getSumPrice(this.formData)
    },
    settPageChange(pg) {
      this.settTablePagina.page = pg
      this.getTableData(this.formData)
      this.getSumPrice(this.formData)
    },
    // 累计已结算和未结算金额
    getSumPrice(par) {
      request({
        url: "system/settlement/getStatistics",
        method: "GET",
        params: {...par}
      }).then((res) => {
        console.log(res, 12);
        this.settled = res.data.settlePrice
        this.unsettled = res.data.unSettlePrice
      })
    },
    // 导出表格
    downExcel(where) {
      if (where == "结算管理") {
        let params = { ...this.formData,isAsc:"desc",}
        this.download('system/settlement/export', {
          ...params
        }, '结算列表.xls');
      } else if (where == "明细清单") {
        let params = {
          settlementId: this.currentSettlementId,
          isAsc: "desc",
        }
        this.download('system/settlement/exportSettleOrderList', {
          ...params
        }, '明细清单.xls');
      }
    },

    // 搜索按钮--筛选
    searchData() {
      this.getTableData(this.formData)
      this.getSumPrice(this.formData)
    },
    // 请求道路数据
    getRoadData() {
      request({
        url: "system/road/getAll",
        method: "GET"
      }).then((res) => {
        this.options2 = res.data
      })
    },
    // 请求公司数据
    getCompany() {
      request({
        url: "system/enterprise/getAll",
        method: "GET"
      }).then((res) => {
        this.options1 = res.data
      })
    },
    // 请求表格数据
    getTableData(par) {
			this.loading = true;
      request({
        url: "system/settlement/queryList",
        method: "GET",
        params: {
          ...par,
          page: this.settTablePagina.page,
          pageSize: this.settTablePagina.pageSize,
          isAsc: "desc",
          orderBy:"t.create_time",
        }
      }).then((res) => {
        this.tableData = res.rows
        this.settTablePagina.total = res.total
				this.loading = false;
      }).catch(() => {
				this.loading = false;
			});
    },
    // 请求详情数据
    getInfoData(id) {
      return request({
        url: `system/settlement/queryById/${id}`,
        method: "GET",
        params: {}
      })
    },
    // 结算相关操作点击函数
    openSettOpear(type, scope) {
      this.showSeOp = true
      this.mxTable =[]
      this.mxTablePagina.total = 0
      this.mxTablePagina.page = 1
      this.mxTablePagina.pageSize = 4
      // 存储当前结算id
      this.currentSettlementId = scope.row.id
      this.getInfoData(scope.row.id).then((res) => {
        // 详情数据
        if (res.data.images) {
          res.data.images = JSON.parse(res.data.images).join();
        }
        this.publicData = res.data
      })

      if (type == "结算操作") {
        // 数据重置
        this.jsCaoZuo = {
          userName: Cookies.get("username"),
          beiZhu: "",
          imgs: [],
          files:[]
        }
        this.$nextTick(() => {
          this.$refs.uploadCom.clearFiles()
        })
        // 弹窗控制
        this.dialogControl = {
          showCaoZuo:true,
          showJSinfo:false,
          showMingXi:false,
          dlogTitle1:"项目结算操作",
          dlogTitle2:"结算操作",
          width:"860px"
        }
      }else if(type=="结算信息"){
        this.dialogControl = {
          showCaoZuo: false,
          showJSinfo: true,
          showMingXi: false,
          dlogTitle1: "项目结算信息",
          dlogTitle2: "结算操作",
          width: "860px"
        };
      }else if(type=="明细清单"){
        this.dialogControl = {
          showCaoZuo:false,
          showJSinfo:false,
          showMingXi:true,
          dlogTitle1:"结算明细清单",
          dlogTitle2:"明细清单",
          width:"964px"
        }
        this.getMxTableData({
          settlementId: scope.row.id,
          page: this.mxTablePagina.page,
          pageSize:this.mxTablePagina.pageSize,
        })
      }
    },
    getMxTableData(par) {
      // 清单表格数据
        request({
          url: "system/settlement/querySettleOrderList",
          method: "GET",
          params: {
            ...par,
            isAsc: "desc",
            orderBy:"t.create_time",
          }
        }).then((res) => {
          console.log(res);
          this.mxTable = res.rows
          this.mxTablePagina.total = res.total
        })
    },
    // 图片上传成功回调
    uploadImgSuccess(res) {
      this.jsCaoZuo.imgs = []
      this.$refs.uploadCom.uploadFiles.forEach((item) => {
        this.jsCaoZuo.imgs.push(item.response.data)
      })
    },
    uploadImgRemove(file, files) {
      this.jsCaoZuo.imgs = []
      this.$refs.uploadCom.uploadFiles.forEach((item) => {
        this.jsCaoZuo.imgs.push(item.response.data)
      })
    },
    // 结算操作提交
    settComfirm() {
      this.$refs.txtaform.validate((valid) => {
        if (valid) {
          this.$confirm('您确定要提交结算吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            modal.loading("提交中,请稍等")
            // 结算请求
            request({
              url: "system/settlement/completeSettle",
              method: "POST",
              data: {
                id: this.publicData.id,
                remark: this.jsCaoZuo.beiZhu,
                images: JSON.stringify(this.jsCaoZuo.imgs),
              }
            }).then((res) => {
              this.showSeOp = false
              modal.closeLoading()
              this.getTableData(this.formData)
              console.log(res);
            }).catch((error) => {
              modal.closeLoading()
            })
          })
        } else {
          return false;
        }
      });
    },
  },
};
