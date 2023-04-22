<template>
  <div class="hn-myctomer-main">
    <div class="hn-mctm-head">
      <div class="hn-mctmh-left">
        <el-button class="hn-mctmhl-btn" icon="el-icon-plus" type="primary">添加新客户</el-button>
        <span class="hn-mctmhl-text">右侧“刷新”按钮可以帮助更新页面数据</span>
      </div>
      <div class="hn-mctmh-right">
        <i class="hn-mctmhr-icon el-icon-refresh"></i>
        <i class="hn-mctmhr-icon el-icon-s-operation"></i>
      </div>
    </div>
    <el-row class="hn-mctm-search" :gutter="20">
      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" @change="staffChange" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="statusChange" placeholder="全部状态">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-input placeholder="请输入手机号" prefix-icon="el-icon-search" v-model="value">  </el-input>
      </el-col>
      
      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-date-picker v-model="value" type="date" placeholder="请选择日期"></el-date-picker>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="provChange" placeholder="全部省份">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="cityChange" placeholder="全部城市">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-select v-model="value" clearable @change="areaChange" placeholder="全部地区">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>

      <el-col :xs="{span:4}" :sm="{span:3}">
        <el-button icon="el-icon-search" @click="hnRouterPush('/customerInfo')" type="success">搜索</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="dictName" label="字典名称">
      </el-table-column>
      <el-table-column prop="dictUse" label="字典是否正在使用">
        <template slot-scope="scope">
          <!-- <span>{{ scope.row.dictUse ? '使用中' : '未使用' }}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作">
        <template slot-scope="scope">
          <el-button type="warning" icon="el-icon-delete">释放客户</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData:[],
      value:"",
      options:[],
    }
  },
  mounted() {

  },
  methods: {
    // 员工改变
    staffChange(e){
      console.log(e,"员工")
    },
    // 状态改变
    statusChange(e){
      console.log(e,"状态")
    },
    // 省份改变
    provChange(e){
      console.log(e,"省份")
    },
    // 城市改变
    cityChange(e){
      console.log(e,"城市")
    },
    // 省份改变
    areaChange(e){
      console.log(e,"地区")
    },
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.el-input{
  width: unset !important;
}
</style>