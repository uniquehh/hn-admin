<template>
  <div class="app-container">
    <el-form v-model="form" size="small" :inline="true" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="关键字:" prop="menuName">
            <el-input
              placeholder="请输入电站全称"
              clearable
              v-model="queryParmas.stationName"
            />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="统计日期:" prop="menuName">
            <el-date-picker
              v-model="dateArr"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="投放项目:" prop="menuName">
            <el-select
              v-model="queryParmas.projectId"
              clearable
              placeholder="请选择站点投放项目"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.projectName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="投放道路:" prop="menuName">
            <el-select
              v-model="queryParmas.roadId"
              clearable
              placeholder="请选择充电站投放道路"
            >
              <el-option
                v-for="item in options2"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchE"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div>
      <div
        style="
          width: 90%;
          height: 30%;
          margin-left: 30px;
          border-radius: 10px;
          border: 1px solid #ccc;
        "
      >
        <div class="Echarts">
          <div id="main" class="peyforE"></div>
        </div>
      </div>

      <div
        style="
          width: 90%;
          height: 30%;
          margin-left: 30px;
          margin-top: 20px;
          padding-top: 30px;
          padding-left: 30px;
          box-sizing: border-box;
          border-radius: 10px;
          border: 1px solid #ccc;
        "
      >
        <div class="Echarts">
          <div id="bing" class="peyforE"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import control from "./control.js";
export default control;
</script>

<style scoped>
.peyforE {
  width: 900px;
  height: 400px;
  margin: 0 auto;
}
</style>