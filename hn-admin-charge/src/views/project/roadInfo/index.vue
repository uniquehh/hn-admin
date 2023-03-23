<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">

        <el-form-item>
          <el-button v-hasPermi="['system:road:create']" type="primary" size="mini" icon="el-icon-plus" plain @click="handleCreate">新增</el-button>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate">编辑</el-button>
          <el-button type="primary" size="mini">删除</el-button> -->
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table :data="tableData" v-loading="loading" border :highlight-current-row="true" row-key="id" :stripe="true">
        <el-table-column fixed prop="name" width=250 align="center" label="道路名称">
          <template slot-scope="scope">
            <el-link type="primary" @click.stop="handleView(scope.row)">{{scope.row.name}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :show-overflow-tooltip="true" align="center" label="备注">
        </el-table-column>
        <el-table-column align="center" width=180 label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" v-hasPermi="['system:road:edit']"
              @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['system:road:delete']"
              @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 发布公告 -->
    <el-dialog :title="title" width="500px" :visible.sync="open" append-to-body :close-on-press-escape="false"
      :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="道路名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入道路名称" maxlength="50" />
        </el-form-item>



        <el-form-item label="备注：">
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

    <roadDetail ref="roadDetailRef" />
  </div>
</template>

<script>
  import control from "./control.js";
  export default control;
</script>

<style></style>
