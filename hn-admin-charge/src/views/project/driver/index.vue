<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form size="small" :inline="true">
        <el-form-item label="关键字" prop="menuName">
          <el-input placeholder="请输入司机姓名或联系方式" clearable v-model="queryParams.keyword" />
        </el-form-item>

        <el-form-item label="所属项目" prop="menuName">
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchDrive">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:driver:create']" type="primary" size="mini" icon="el-icon-plus" plain @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column fixed prop="data1" align="center" label="司机姓名">
        </el-table-column>
        <el-table-column prop="data12" label="司机头像" align="center">
          <template slot-scope="scope">
            <img class="avatarImg" :src="scope.row.data12 ? scope.row.data12 : ''" />
          </template>
        </el-table-column>
        <el-table-column prop="data2" label="联系方式" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="dirverDetail(scope.row)">{{scope.row.data2}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="data3" align="center" label="所属项目编号">
        </el-table-column>
        <el-table-column prop="data4" align="center" label="所属项目">
        </el-table-column>
        <el-table-column prop="data5" align="center" label="年龄">
        </el-table-column>
        <el-table-column prop="data6" align="center" label="性别">
        </el-table-column>
        <el-table-column prop="data7" align="center" label="绑定设备数">
        </el-table-column>
        <el-table-column prop="data8" align="center" label="累计充电量〔度)">
        </el-table-column>
        <el-table-column prop="data9" align="center" label="累计充电金额">
        </el-table-column>
        <el-table-column prop="data13" align="center" label="状态">
        </el-table-column>
        <el-table-column width="300" align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdata(scope.row)"
              v-hasPermi="['system:driver:update']"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="text" 
              icon="el-icon-delete"
              v-hasPermi="['system:driver:updateStatus']"
              @click="freezeUsers(scope.row)"
              >{{ scope.row.data10? "解冻" : "冻结" }}</el-button
            >

            <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              v-hasPermi="['system:driver:resetPassword']"
              @click="resetPwd(scope.row)"
              >重置密码</el-button
            >
            <!-- <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              v-hasPermi="['system:user:remove']"
              @click="openAAA(scope.row)"
              >打开</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <!-- 司机详情 -->
    <Dirver ref="dInfo"></Dirver>

    <!-- 发布公告 -->
    <el-dialog :title="title" width="50%" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col>
            <el-form-item label="上传图片" prop="headImage">
              <span style="font-size: 12px; margin-left: 10px; color: #aaa">(推荐尺寸: 100px * 100px)</span>
              <el-upload class="avatar-uploader" ref="upload" :action="uploadFileUrl" :headers="uploadHeaders"
                :show-file-list="false" :on-success="
                  (response, file, fileList) =>
                    handleImageUrlSuccess(response, file, fileList)
                " :limit="1" accept=".png,.jpg,.jpeg" :auto-upload="true">
                <img v-if="form.headImage != '' && form.headImage" :src="form.headImage" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>


          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="司机名称:" prop="name">
              <el-input placeholder="请输入司机姓名" v-model="form.name" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="电话:" prop="phone">
              <el-input placeholder="请输入司机电话号码" v-model="form.phone" type="text" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" controls-position="right" :min="0" :max="100" size="mini">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="司机性别" prop="sex">
              <el-select v-model="form.sex" clearable placeholder="请选择性别">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="所属项目:" prop="projectId">
            <el-select v-model="form.projectId" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-row>
      </el-form>

      <div class="ps" v-if="showTipsfont">
        注：司机添加成功后，司机端APP默认密码为“手机号码后8位”
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <pagination 
    v-if="total > 0" 
    :total="total" 
    :page.sync="queryParams.page" 
    :limit.sync="queryParams.pageSize"
    @pagination="driverList" 
    />
  </div>
</template>

<script>
  import control from "./control.js";
  export default control;
</script>

<style scoped>
  .ps {
    color: #d9001b !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px solid #ddd;
    margin-top: 10px;
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

  .avatarImg {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
  }
</style>
