<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-form size="small" :inline="true">
        <el-form-item label="关键字：" prop="keyword">
          <el-input placeholder="输入设备编号" clearable v-model="queryParams.keyword" />
        </el-form-item>

        <el-form-item label="所属项目：" prop="projectId">
          <el-select v-model="queryParams.projectId" :default-first-option="true" @change="changeSearchProject"
            filterable clearable placeholder="全部">
            <el-option v-for="(item, index) in projectList" :key="item.id" :label="item.projectName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属施工单位：" prop="constructionEnterpriseId">
          <el-select v-model="queryParams.constructionEnterpriseId" :default-first-option="true" filterable clearable
            placeholder="全部">
            <el-option v-for="(item, index) in enterpriseSearchList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="accessFlag">
          <el-select v-model="queryParams.accessFlag" :default-first-option="true" filterable clearable
            placeholder="全部">
            <el-option v-for="(item, index) in accessFlagList" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属分类：" prop="typeValue">
          <el-cascader clearable placeholder="全部" :options="carType" v-model="queryParams.carType" :props="props"
            clearable @change="changeSearchCarType"></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-hasPermi="['system:car:create']" type="primary" size="mini" icon="el-icon-plus" plain
            @click="handleUpdata('添加')">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-row>
      <el-table v-loading="loading" :data="tableData" border style="width: 100%;">
        <el-table-column fixed prop="data1" align="center" label="设备图片">
          <template slot-scope="scope">
            <img class="dzIMg" :src="scope.row.imageUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="code" label="设备编码" align="center">
          <template slot-scope="scope">
            <el-link type="primary" @click="getCarInfo_Child(scope)">{{ scope.row.code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="name" align="center" label="设备名称">
          <template slot-scope="scope">
            <el-link type="primary" @click="getCarInfo_Child(scope)">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属分类">
          <template slot-scope="scope">
            <div>{{ scope.row.firstName + '-' + scope.row.sencondName + '-' + scope.row.thirdName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" align="center" label="所属项目">
          <template slot-scope="scope">
            <el-link type="primary" @click="viewProject(scope.row)">{{ scope.row.projectName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="constructionEnterpriseName" align="center" label="所属施工单位">
          <template slot-scope="scope">
            <el-link type="primary" @click="viewConstunction(scope.row)">{{ scope.row.constructionEnterpriseName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="司机">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.drivers" :key="index">
              <el-link type="primary" @click="viewDriver(item.driverId)">{{ item.driverName }}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            {{ scope.row.accessFlag == 2 ? '离场' : scope.row.accessFlag == 1 ? '进场' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.accessFlag == 2" type="text" @click="updateAccessFlag(scope.row)"
              v-hasPermi="['system:car:updateAccessFlag']">
              进场
            </el-button>
            <el-button size="mini" v-else-if="scope.row.accessFlag == 1" type="text"
              @click="updateAccessFlag(scope.row)" v-hasPermi="['system:car:updateAccessFlag']">
              离场
            </el-button>
            <el-button size="mini" type="text" @click="handleUpdata('编辑', scope)" v-hasPermi="['system:car:update']">编辑
            </el-button>
            <el-button size="mini" type="text" @click="getCarInfo_Child(scope)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 弹窗 -->
    <carinfo ref="opencarinfo"></carinfo>
    <el-dialog :title="form.title" width="700px" :visible.sync="open" append-to-body :close-on-press-escape="false"
      :close-on-click-modal="false" :destroy-on-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="medium">
        <el-row>
          <el-col>
            <el-form-item label="上传图片：" prop="imageUrl">
              <div class="tishi" style="font-size: 12px; color: #aaa">(推荐尺寸: 100px * 100px)</div>
              <el-upload class="caravatar-uploader" :action="uploadFileUrl" :show-file-list="false"
                :headers="uploadHeaders" :auto-upload="true" :on-success="uploadImgSuccess" :limit="1" ref="uploadImg">
                <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                <i v-else class="el-icon-plus caravatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编码：" prop="code">
              <el-input class="select-or-input" placeholder="请输入设备编码" v-model="form.code" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设备名称：" prop="name">
              <el-input class="select-or-input" placeholder="请输入设备名称" v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label="所属分类：" prop="typeValue">
            <el-cascader class="select-or-input" :props="props" clearable placeholder="请选择设备分类"
            
              v-model="form.carType"
              :options="carType" @change="changeCarType"></el-cascader>
          </el-form-item>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="所属项目：" prop="projectId">
              <el-select class="select-or-input" v-model="form.projectId" :default-first-option="true"
                placeholder="请选择项目" @change="selectProject">
                <el-option v-for="(item, index) in projectList" :key="item.id" :label="item.projectName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属施工单位：" prop="constructionEnterpriseId">
              <el-select class="select-or-input" v-model="form.constructionEnterpriseId" :default-first-option="true"
                placeholder="请选择施工单位" @change="selectEnterprise">
                <el-option v-for="(item, index) in enterpriseList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="选择绑定作业司机：">
          <div class="checkbox" v-if="drivers.length > 0">
            <el-checkbox v-model="checkAll" @change="handleCheckAll"> 全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="driverIds">
              <el-checkbox class="sijicheckbox" v-for="(item, index) in drivers" :label="item.id" :key="item.id"
                @change="handleCheck">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="nodata" v-else>当前项目下无任何作业司机！</div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
    <projectDetail ref="projectDetail" />
    <constunctionDetail ref="constunctionDetail" />
    <driverDetail ref="driverDetail" />
  </div>
</template>

<script>
  import control from './control.js';
  export default control;
</script>

<style scoped lang="scss">
  // 分页器样式
  .el-pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    ::v-deep .el-pagination__sizes {
      margin-right: 8px !important;
    }

    ::v-deep .el-pagination__jump {
      margin-left: 0 !important;
    }
  }

  .sijicheckbox {
    width: 180px;
    color: #1890ff;
  }

  .dzIMg {
    width: 100px;
    height: 80px;
  }

  .caravatar-uploader {
    ::v-deep .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  }

  .caravatar-uploader {
    ::v-deep.el-upload:hover {
      border-color: #409eff;
    }
  }

  .caravatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 70px;
    height: 70px;
    line-height: 70px;
    text-align: center;
  }

  .avatar {
    width: 70px;
    height: 70px;
    display: block;
  }

  .select-or-input {
    width: 250px;
  }
</style>
