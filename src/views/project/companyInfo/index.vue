<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="关键字" prop="keyword">
          <el-input placeholder="请输入公司名称/负责人/电话" clearable v-model="queryParams.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:enterprise:create']" type="primary" size="mini" icon="el-icon-plus" plain @click="handleCreate">新增</el-button>
          <!--<el-button type="primary" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="primary" size="mini">删除</el-button> -->
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table :data="tableData" v-loading="loading" border :highlight-current-row="true" row-key="id" :stripe="true">
        <el-table-column fixed prop="sampleName" width=310 align="center" label="公司简称 ">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleView(scope.row)">{{scope.row.sampleName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="contactName" width=150 label="负责人" align="center">
        </el-table-column>
        <el-table-column prop="contactPhone" width=150 label="负责人电话" align="center">
        </el-table-column>
        <el-table-column prop="remark" align="left" label="备注">
        </el-table-column>
        <el-table-column align="center" width=180 label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['system:enterprise:update']"
              @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:enterprise:delete']"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 发布公告 -->
    <el-dialog :title="title" width="500px" :visible.sync="open" append-to-body :close-on-press-escape="false"
      :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="公司简称" prop="sampleName">
          <el-input v-model="form.sampleName" placeholder="请输入公司简称" maxlength="32" />
        </el-form-item>

        <el-form-item label="负责人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入负责人姓名" maxlength="20" />
        </el-form-item>

        <el-form-item label="负责人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" type="text" placeholder="请输入负责人电话" maxlength="15" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" maxlength="500" show-word-limit
            :autosize="{ minRows: 5, maxRows: 10}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <enterprise ref="companyDetail" />
  </div>
</template>

<script>
  import control from "./control.js";
  export default control;
</script>

<style></style>
