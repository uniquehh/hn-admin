<template>
  <div class="app-container closeAcount">
    <el-row :gutter="10">
      <el-form size="small" :model="formData"  :inline="true">
        <el-form-item label="关键字：">
          <el-input
            placeholder="输入项目名称/项目编号/负责人姓名/电话"
            clearable
            v-model="formData.keyword"
          />
        </el-form-item>

        <el-form-item label="所属公司：">
          <el-select v-model="formData.enterpriseId" clearable placeholder="选择所属公司">
            <el-option
              v-for="item in options1"
              :key="item.id+'a'"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属道路：">
          <el-select v-model="formData.roadId" clearable placeholder="选择所属道路">
            <el-option
              v-for="item in options2"
              :key="item.id+'b'"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账期选择：" class="picker">
          <el-date-picker v-model="formData.month"
            type="month"
            placeholder="选择账期"
            value-format="yyyy-MM"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="结算状态：">
          <el-select
            v-model="formData.status"
            clearable
            placeholder="选择结算状态"
          >
            <el-option
              v-for="item in options4"
              :key="item.value+'d'"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"
            @click="searchData"
          >
            搜索
          </el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:settlement:export']" type="primary" size="mini" @click="downExcel('结算管理')">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </el-row>

     <el-row>
      <el-col :span="7"><div class="text">累计已结算总额(元)：{{ settled }}</div></el-col>
      <el-col :span="7"><div class="text">累计未结算总额(元)：{{ unsettled }}</div></el-col>
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%;">
        <el-table-column fixed prop="projectCode" align="center" label="项目编号">
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="enterpriseName" align="center" label="所属公司">
        </el-table-column>
        <el-table-column prop="roadName" align="center" label="所属道路">
        </el-table-column>
        <el-table-column prop="projectContactName" align="center" label="负责人">
        </el-table-column>
        <el-table-column prop="projectContactPhone" align="center" label="负责人电话">
        </el-table-column>
        <el-table-column align="center" label="账单日">
          <template slot-scope="scope">
              <div>{{ scope.row.day +"号" }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="month" align="center" label="账期">
        </el-table-column>
        <el-table-column prop="settlePrice" align="center" label="结算总额(元)">
        </el-table-column>
        <el-table-column align="center" label="结算状态">
          <template slot-scope="scope">
            <div>{{ scope.row.status == 0 ? '未出账' : scope.row.status ==1?'待结算':'已结算'}}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150px" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="openSettOpear('明细清单', scope)"
            >
              明细清单
            </el-button>
            <el-button
              v-if="scope.row.status ==2"
              size="mini"
              type="text"
              @click="openSettOpear('结算信息', scope)"
              >结算信息</el-button
            >
            <el-button
              v-if="scope.row.status == 1"
              size="mini"
              type="text"
              v-hasPermi="['system:settlement:completeSettle']"
              @click="openSettOpear('结算操作', scope)"
              >结算操作</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-pagination
      background
      v-show="settTablePagina.total > 0"
      :total="settTablePagina.total"
      :current-page="settTablePagina.page"
      :page-sizes="settTablePagina.pageSizes"
      :page-size="settTablePagina.pageSize"
      @size-change="settPageSizeChange"
      @current-change="settPageChange"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 结算操作弹窗 -->
    <el-dialog
      :visible.sync="showSeOp"
      :width="dialogControl.width"
      align-center
      class="settdialog"
    >
      <div class="settcont">
        <div class="htitle">{{dialogControl.dlogTitle1}}</div>
        <div class="wrap">
          <div class="item">
            <div class="cont mgr30">
              <div class="td">项目编号：</div>
              <div class="tdtext curr">{{ publicData.projectCode }}</div>
            </div>
            <div class="cont">
              <div class="td">项目名称：</div>
              <div class="tdtext curr">{{ publicData.projectName }}</div>
            </div>
          </div>
          <div class="item">
            <div class="cont mgr30">
              <div class="td">负责人：</div>
              <div class="tdtext">{{ publicData.projectContactName }}</div>
            </div>
            <div class="cont">
              <div class="td">负责人电话：</div>
              <div class="tdtext">{{ publicData.projectContactPhone }}</div>
            </div>
          </div>
          <div class="item">
            <div class="cont mgr30">
              <div class="td">账单日：</div>
              <div class="tdtext">{{ publicData.day+"号" }}</div>
            </div>
            <div class="cont">
              <div class="td">结算帐期：</div>
              <div class="tdtext">{{ publicData.month }}</div>
            </div>
          </div>
          <div class="item">
            <div class="cont mgr30">
              <div class="td">开始时间：</div>
              <div class="tdtext">{{ publicData.startDate + " " + "00:00:00" }}</div>
            </div>
            <div class="cont">
              <div class="td">结束时间：</div>
              <div class="tdtext">{{ publicData.endDate + " " + "23:59:59" }}</div>
            </div>
          </div>
          <div class="item bdnone">
            <div class="cont mgr30">
              <div class="td">结算总额(元)：</div>
              <div class="tdtext" style="font-weight:bold;color: red;">{{ publicData.settlePrice }}</div>
            </div>
            <div class="cont">
              <div class="td">结算状态：</div>
              <div class="tdtext">{{ publicData.status == 0 ? "未出账" : publicData.status == 1 ? "待结算" : "已结算" }}</div>
            </div>
          </div>
        </div>
        <div class="htitle">{{dialogControl.dlogTitle2}}</div>
        <div class="wrap">
          <div class="item" v-show="dialogControl.showJSinfo||dialogControl.showCaoZuo">
            <div class="cont mgr30" v-show="dialogControl.showCaoZuo">
              <div class="td">登陆账号：</div>
              <div class="tdtext">{{ jsCaoZuo.userName }}</div>
            </div>
            <div class="cont mgr30" v-show="dialogControl.showJSinfo">
              <div class="td">登陆账号：</div>
              <div class="tdtext">{{ publicData.settleName }}</div>
            </div>
            <div class="cont" v-show="dialogControl.showJSinfo">
              <div class="td">结算时间：</div>
              <div class="tdtext">{{ publicData.settleTime }}</div>
            </div>
          </div>
          <div class="mingxi" v-show="dialogControl.showMingXi">
            <span class="cdtd">累计充电度数(度)：</span>
            <span class="cdtext">{{ publicData.totalCharge }}</span>
            <span class="cdtd">累计订单总额(元)：</span>
            <span class="odtext">{{ publicData.settlePrice }}</span>
          </div>
          <div class="item bdnone">
            <div class="cont clearflex">
              <div class="td" v-show="dialogControl.showCaoZuo">结算备注(必填)：</div>
              <div class="td" v-show="dialogControl.showJSinfo">结算备注：</div>
              <div class="tdtext" v-show="dialogControl.showCaoZuo">
                <el-form ref="txtaform" :model="jsCaoZuo" :rules="rules">
                  <el-form-item prop="beiZhu">
                    <el-input v-model="jsCaoZuo.beiZhu" maxlength="200" show-word-limit type="textarea" placeholder="限200字内（必填）" />
                  </el-form-item>
                </el-form>
              </div>
              <div class="tdtext" v-show="dialogControl.showJSinfo">
                {{ publicData.remark }}
              </div>
              <!-- 清单明细表格 -->
              <div class="mxtablebox" v-if="dialogControl.showMingXi">
                <el-table :data="mxTable" size="mini" border style="width: 100%;"
                  header-row-class-name="tabhead"
                  cell-class-name="tabcell"
                >
                  <!-- <el-table-column prop="id" align="center" label="订单号" class-name="setcolumn"
                    label-class-name="columnlabel"
                  >
                  </el-table-column> -->
                  <el-table-column prop="orderNo" align="center" label="订单号"
                  >
                  </el-table-column>
                  <el-table-column prop="driverName" align="center" label="司机">
                  </el-table-column>
                  <el-table-column prop="driverPhone" align="center" label="司机手机号">
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
                <el-pagination
                  background
                  v-show="mxTablePagina.total > 0"
                  :total="mxTablePagina.total"
                  :current-page="mxTablePagina.page"
                  :page-sizes="mxTablePagina.pageSizes"
                  :page-size="mxTablePagina.pageSize"
                  @size-change="mxPageSizeChange"
                  @current-change="mxPageChange"
                  layout="total, sizes, prev, pager, next, jumper"
                >
                </el-pagination>
              </div>
            </div>
          </div>
          <div class="item" v-show="dialogControl.showCaoZuo">
            <div class="cont clearflex">
              <div class="uploadtext">
                <div>结算凭证(选填)：</div>
                <div>最多6张凭证图片</div>
              </div>
              <div class="uploadbox">
                <div class="tishi" style="font-size: 12px; color: #aaa">(推荐尺寸: 215px * 115px)</div>
                <el-upload
                  class="setavatar-uploader"
                  :action="uploadFileUrl"
                  list-type="picture-card"
                  :headers="uploadHeaders"
                  :auto-upload="true"
                  :multiple="true"
                  ref="uploadCom"
                  :limit="6"
                  :on-success="uploadImgSuccess"
                  :on-remove="uploadImgRemove"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                </el-dialog>
              </div>
            </div>
          </div>
          <div class="item" v-show="dialogControl.showJSinfo">
            <div class="cont clearflex">
              <div class="td">结算凭证：</div>
              <div class="imgbox">
                <!-- <el-image v-for="(item,index) in publicData.images" 
                :src="item" 
                :key="index+'i'" 
                :preview-src-list="publicData.images">
                </el-image> -->
                <ImagePreview v-if="publicData.images" :src="publicData.images">
                </ImagePreview>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showSeOp = false" v-show="dialogControl.showJSinfo||dialogControl.showMingXi">关闭</el-button>
          <el-button @click="showSeOp = false" v-show="dialogControl.showCaoZuo">取消</el-button>
          <el-button type="primary" @click="settComfirm" v-show="dialogControl.showCaoZuo">
            结算提交
          </el-button>
          <el-button  v-hasPermi="['system:settlement:exportDetail']" type="primary" @click="downExcel('明细清单')" v-show="dialogControl.showMingXi">
            导出清单EXCEL
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import control from "./control.js";
export default control;
</script>

<style scoped lang="scss">
.closeAcount{
  .el-pagination{
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    ::v-deep .el-pagination__sizes{
      margin-right: 8px !important;
    }
    ::v-deep .el-pagination__jump{
      margin-left: 0 !important;
    }
  }
}
.el-row{
  margin:0px !important;
}
.closeAcount{
  ::v-deep .el-input--small .el-input__inner{
    width: 250px;
  }
  ::v-deep .el-date-editor.el-input,.el-date-editor.el-input__inner {
    width: 250px;
  }
  ::v-deep .el-input--suffix .el-input__inner{
    padding: 0 10px;
  }
  ::v-deep .picker .el-input--suffix .el-input__inner{
    padding-left: 30px;
  }
}
.roletext1{
  color: red;
}
.text {
  color: #515a6e;
  line-height: 23px;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
}
// 结算操作弹窗样式
.settcont{
  width: 100%;
  .htitle{
    background-color: #F3F3F3;
    color: #666666;
    padding: 10px;
    font-weight: bold;
  }
  .wrap{
    .mingxi{
      padding: 0 20px;
      padding-top: 10px;
      .cdtext{
        margin-right: 30px;
      }
      .cdtd{
        font-weight: bold;
      }
    }
    .bdnone{
      border: none !important;
    }
    .item{
      display: flex;
      align-items: center;
      padding: 10px 20px;
      border-bottom: 1px solid #DDDDDD;
      ::v-deep .setcolumn{
        color: #108EE9;
      }
      ::v-deep .columnlabel{
        color: #515a6e;
      }
      .curr{
        color: #108EE9;
      }
      .mgr30{
        margin-right: 30px;
      }
      .cont{
        width: 300px;
        display: flex;
        align-items: center;
        .td{
          color: #7F7F7F;
          flex: 0 0 auto;
          font-weight: bold;
        }
        .tdtext{
          ::v-deep textarea{
            width: 600px;
            height: 100px;
            resize: none;
          }
        }
        .uploadtext{
          margin-right: 20px;
          color: #7F7F7F;
          font-weight: bold;
        }
        .imgbox{
          display: flex;
          ::v-deep .el-image{
            width: 215px;
            height: 115px;
            border-radius: 5px;
            margin-right: 20px;
          }
        }
        ::v-deep .tabhead th{
          font-size: 12px !important;
        }
        ::v-deep .tabcell th{
          font-size: 12px !important;
        }
      }
      .clearflex{
        width: unset;
        align-items: flex-start;
      }
    }
  }
}
// 图片上传
</style>
<style lang="scss">
// 图片上传样式
  .setavatar-uploader .el-upload--picture-card {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    font-size: 28px;
    width: 215px;
    height: 115px;
    line-height: 115px;
    text-align: center;
  }
  .setavatar-uploader .el-upload--picture-card:hover {
    border-color: #409EFF !important;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 215px;
    height: 115px;
  }
</style>