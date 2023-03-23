<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="关键字" prop="keyword">
          <el-input placeholder="请输入项目编码或名称" clearable v-model="queryParams.keyword" />
        </el-form-item>

        <el-form-item label="所属公司" prop="enterpriseId">
          <el-select v-model="queryParams.enterpriseId" @change="changeSelectEnterprise" :default-first-option="true"
            filterable clearable placeholder="全部">
            <el-option v-for="item in enterpriseSearchList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属道路" prop="roadId">
          <el-select v-model="queryParams.roadId" @change="changeSelectRoad" :default-first-option="true" filterable
            clearable placeholder="全部">
            <el-option v-for="item in roadSearchList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="添加日期" prop="status">
          <el-date-picker v-model="value2" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="selectSearchDateRange" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button  v-hasPermi="['system:project:create']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:project:create']" type="primary" size="mini" icon="el-icon-plus" plain @click="handleCreate">新增</el-button>
          <!--<el-button type="primary" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="primary" size="mini">删除</el-button> -->

        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table :data="tableData" v-loading="loading" border :highlight-current-row="true" row-key="id" :stripe="true">
        <el-table-column prop="code" width=120 align="center" label="项目编号 ">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleView(scope.row)">{{scope.row.code}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" width=150 label="项目名称" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleView(scope.row)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="contactName" width=80 align="center" label="项目负责人">
        </el-table-column>
        <el-table-column prop="contactPhone" width=100 align="center" label="负责人电话">
        </el-table-column>
        <el-table-column prop="enterpriseName" width=220 align="center" label="所属公司">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleViewCompany(scope.row)">{{scope.row.enterpriseName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="roadName" width=180 align="center" label="所属道路">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleViewRoad(scope.row)">{{scope.row.roadName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="address" width=200 align="center" label="工程建设地址">
        </el-table-column>
        <el-table-column prop="settleDay" width=80 align="center" label="账单日">
        </el-table-column>
        <el-table-column prop="constructionEnterpriseAmount" width=80 align="center" label="施工单位数">
        </el-table-column>
        <el-table-column prop="deviceAmount" width=80 align="center" label="设备数">
        </el-table-column>
        <el-table-column prop="driverAmount" width=80 align="center" label="司机数量">
        </el-table-column>
        <el-table-column prop="chargingCapacity" width=80 align="center" label="累计充电量(度)">
        </el-table-column>
        <el-table-column prop="chargingPrice" width=80 align="center" label="累计充金额(元)">
        </el-table-column>
        <el-table-column prop="createTime" width=80 align="center" label="创建日期">
        </el-table-column>
        <el-table-column align="center" width="200" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['system:project:update']">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-refresh" @click="handleResetPassword(scope.row)"
              v-hasPermi="['system:project:resetPassword']">重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 发布项目 -->
    <el-dialog :title="title" width="50%" :visible.sync="open" append-to-body :close-on-press-escape="false"
      :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="medium">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目编码:" prop="code">
              <el-input placeholder="请输入项目编码" v-model="form.code" maxlength="50" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="项目名称:" prop="name">
              <el-input placeholder="请输入项目名称" v-model="form.name" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="项目负责人:" prop="contactName">
              <el-input placeholder="请输入项目负责人姓名" v-model="form.contactName" maxlength="5" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="负麦人电话:" prop="contactPhone">
              <el-input type="text" placeholder="请输入项目负责人联系电话" v-model="form.contactPhone" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="工程建设地址:" prop="address" label-width="101px">
              <el-input placeholder="请输入项目施工地址" v-model="form.address" maxlength="250" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="账单日:" prop="settleDay">
              <el-input-number v-model="form.settleDay" :min="1" :max="25" :step="1" controls-position="right">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属公司:" prop="enterpriseId">
              <el-select v-model="form.enterpriseId" :default-first-option="true" filterable clearable
                placeholder="请选择">
                <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属道路:" prop="roadId">
              <el-select v-model="form.roadId" :default-first-option="true" filterable clearable placeholder="请选择">
                <el-option v-for="item in roadList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细说明" prop="description">
          <editor :minHeight="300" v-model="form.description"> </editor>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <projectDetail ref="projectDetailRef" />
    <roadDetail ref="roadDetailRef" />
    <enterprise ref="companyDetailRef" />
  </div>
</template>

<script>
  import control from "./control.js";
  export default control;
</script>

<style scoped>
  .line {
    line-height: 40px;
    padding: 0rpx 50px;
    padding-left: 10px;
  }

  .line~.line {
    border-bottom: 1px solid #eee;
  }

  .header {
    background-color: #f3f3f3;
    line-height: 40px;
    font-weight: bold;
    margin: 0px -20px;
    padding: 0px 20px;
  }

  .line span {
    display: inline-block;
    width: 50%;
  }
</style>
