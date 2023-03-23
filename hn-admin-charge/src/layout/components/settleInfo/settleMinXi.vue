<template>
  <div class="carinfo">
    <el-dialog title="结算明细清单" width="700px" :visible.sync="showDialog" append-to-body>
      <el-form ref="carDialogForm" class="carinfo" :model="publicData" label-width="100px">
        <el-row class="htitle">
          <el-col>
            结算明细：
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目编号：">
              <div class="tdtext">{{ publicData.projectCode }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称：">
              <div class="tdtext">{{ publicData.projectName }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人：">
              <div class="tdtext">{{ publicData.projectContactName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人电话：">
              <div class="tdtext">{{ publicData.projectContactPhone }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="账单日：">
              <div class="tdtext">{{ publicData.day+"号" }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算账期：">
              <div class="tdtext">{{ publicData.month }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间：">
              <div class="tdtext">{{ publicData.startDate }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间：">
              <div class="tdtext">{{ publicData.endDate }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lastrow">
          <el-col :span="12">
            <el-form-item label="结算总额(元)：">
              <div class="tdtext">{{ publicData.settlePrice }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算状态：">
              <div class="tdtext">{{ publicData.status == 0 ? "未出账" : publicData.status == 1 ? "待结算" : "已结算" }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="htitle">
          <el-col>
            明细清单：
          </el-col>
        </el-row>
        <div class="leiji">
          <span class="diantitle">累计充电度数(度)</span>
          <span class="dianct">{{ publicData.totalCharge }}</span>
          <span class="diantitle">累计订单总额(元)</span>
          <span class="dianct">{{ publicData.settlePrice }}</span>
        </div>
        <el-table :data="mxTableData" size="mini" border style="width: 100%;max-height: 300px;" header-row-class-name="tabhead"
          cell-class-name="tabcell">
          <el-table-column prop="orderNo" align="center" label="订单号">
          </el-table-column>
          <el-table-column prop="driverName" align="center" label="司机">
          </el-table-column>
          <el-table-column prop="driverPhone" align="center" label="司机手机">
          </el-table-column>
          <el-table-column prop="carCode" align="center" label="设备编号">
          </el-table-column>
          <el-table-column prop="constructionEnterpriseName" align="center" label="车辆施工单位">
          </el-table-column>
          <el-table-column prop="chargingStationName" align="center" label="充电站">
          </el-table-column>
          <el-table-column prop="startTime" align="center" label="充电开始时间">
          </el-table-column>
          <el-table-column prop="totalCharge" align="center" label="充电量(度)">
          </el-table-column>
          <el-table-column prop="totalMoney" align="center" label="订单总额(元)">
          </el-table-column>
          <el-table-column prop="totalElectricMoney" align="center" label="电费金额(元)">
          </el-table-column>
          <el-table-column prop="totalServiceMoney" align="center" label="服务费金额(元)">
          </el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      // 显示关闭弹窗
      showDialog: false,
      // 结算明细基础数据
      publicData: {
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
        status: "",
      },
      // 明细清单表格数据
      mxTableData:[],
    }
  },
  methods: {
    // 父组件调用该方法打开弹窗查看详情
    openSettInfoDialog(id) {
      this.showDialog = true
      this.$nextTick(() => {
        this.getSettInfo(id).then((res) => {
          this.publicData = res.data
        })
        // 清单表格
        this.getMinXiTable(id)
      })
    },
    getSettInfo(id) {
      return request({
        url: `system/settlement/queryById/${id}`,
        method: "GET",
        params: {}
      })
    },
    // 获取清单表格数据
    getMinXiTable(id) {
      request({
        url: "system/settlement/querySettleOrderList",
        method: "GET",
        params: {
          settlementId:id,
          page:1,
        }
      }).then((res) => {
        console.log(res);
        this.mxTableData = res.rows
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.carinfo {
  .leiji{
    padding: 20px 10px;
  }
  .lastrow{
    border: none !important;
  }
  .el-form-item {
    margin-bottom: 0;
  }

  .el-row {
    padding: 10px 0;
    border-bottom: 1px solid #d9d9d9;
  }
  .htitle{
    background-color: #F3F3F3;
    color: #666666;
    padding: 10px;
    font-weight: bold;
    border: none;
  }
}
</style>