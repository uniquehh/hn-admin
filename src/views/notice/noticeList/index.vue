<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form size="small" :inline="true">
        <el-form-item label="标题" prop="menuName">
          <el-input
            placeholder="请输入公告标题"
            clearable
            v-model="queryParams.title"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="status">
          <el-date-picker
            v-model="date"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
          <el-button
            v-hasPermi="['system:notice:create']"
            type="primary"
            size="mini"
            icon="el-icon-plus"
            plain
            @click="publish()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: auto"
      >
        <el-table-column fixed prop="title" label="标题 ">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleView(scope.row)">{{
              scope.row.title
            }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="projectNames" label="针对项目" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.projectIds == 0">
              <span>全部项目</span>
            </div>
            <div v-else>
              <span
                class="gap"
                v-for="(item, index) in scope.row.projects"
                :key="index"
              >
                <el-link
                  type="primary"
                  @click="handleView2(scope.row, index)"
                  >{{ item.projectName }}</el-link
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="发布时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope" v-if="scope.row.roleId !== 1">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:notice:update']"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:notice:delete']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 发布公告 -->
    <el-dialog :title="title" width="70%" :visible.sync="open" append-to-body>
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="公告标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题（限50字以内）"
            :maxlength="50"
          />
        </el-form-item>
        <el-form-item label="通告发布项目" prop="projectIds">
          <el-checkbox
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >

          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="city in cities"
              :label="city.id"
              :key="city.id"
              >{{ city.projectName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="公告内容" prop="content">
          <Editor :minHeight="300" v-model="form.content"> </Editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 公告详情 -->
    <el-dialog
      v-loading="loading"
      :title="title"
      width="60%"
      :visible.sync="open2"
      append-to-body
    >
      <div class="line">
        <h5>公告标题：</h5>
        {{ detail.title }}
      </div>

      <div class="line" v-if="detail.projectNames">
        <h5>通告发布项目：</h5>
        {{ detail.projectNames.toString() }}
      </div>

      <div class="line fwb">
        <h5>公告内容：</h5>
        <div v-html="detail.content"></div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="open2 = false">取 消</el-button>
      </div>
    </el-dialog>

    <projectDetail ref="projectDetailRef" />

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { spawn } from "child_process";
import control from "./control.js";
export default control;
</script>

<style scoped lang="scss">
.text {
  color: #515a6e;
  line-height: 23px;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 8px;
}

.line {
  line-height: 40px;
  border-bottom: 1px solid #eee;
  padding: 0rpx 50px;
  padding-left: 10px;
  /* background: red; */
}

.header {
  background-color: #f3f3f3;
  font-weight: bold;
  margin: 0px -20px;
  padding: 0px 20px;
}

.line span {
  display: inline-block;
  width: 50%;
}

.gap + .gap::before {
  content: "、";
}
</style>
