<template>
  <div class="carinfo">
    <el-dialog title="项目结算信息" width="700px" :visible.sync="showDialog" append-to-body>
      <el-form ref="carDialogForm" class="carinfo" :model="publicData" label-width="100px">
        <el-row class="htitle">
          <el-col>
            结算信息：
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
              <div class="tdtext">{{ publicData.day + "号" }}</div>
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
            结算操作：
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录账号：">
              <div class="tdtext">{{ publicData.settleName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算时间：">
              <div class="tdtext">{{ publicData.settleTime }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="结算备注：">
              <div class="tdtext">{{ publicData.remark }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="lastrow">
          <el-col>
            <el-form-item class="imgbox" label="结算凭证：">
              <!-- <img v-for="(item,index) in publicData.images" :src="item" :key="index+'i'" /> -->
              <img src="../../../assets/images/jiesuan1.png" alt="" />
              <img src="../../../assets/images/jiesuan2.png" alt="" />
            </el-form-item>
          </el-col>
        </el-row>
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
        day: "",
        endDate: "",
        month: "",
        projectCode: "",
        projectContactName: "",
        projectContactPhone: "",
        projectName: "",
        settleName: "",
        startDate: "",
        totalCharge: "",
        settlePrice: "",
        settleTime: "",
        status: "",
        remark: "",
        images: [],
      },
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
      })
    },
    getSettInfo(id) {
      return request({
        url: `system/settlement/queryById/${id}`,
        method: "GET",
        params: {}
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.carinfo {
  .lastrow {
    border: none !important;
  }

  .el-form-item {
    margin-bottom: 0;
  }
  .imgbox {
    img {
      width: 215px;
      height: 115px;
      border-radius: 5px;
      margin-right: 20px;
    }
  }
  .el-row {
    padding: 10px 0;
    border-bottom: 1px solid #d9d9d9;
  }

  .htitle {
    background-color: #F3F3F3;
    color: #666666;
    padding: 10px;
    font-weight: bold;
    border: none;
  }
}
</style>