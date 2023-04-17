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
    <el-row :gutter="20">
      <el-col>
        <!-- <el-select v-model="value" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </el-col>

      <el-col>
        <!-- <el-select v-model="value" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </el-col>

      <el-col>
        <!-- <el-input placeholder="请输入手机号" prefix-icon="el-icon-search" v-model="input2">  </el-input> -->
      </el-col>
      
      <el-col>
        <!-- <el-input placeholder="请选择日期" prefix-icon="el-icon-date" v-model="input1"> </el-input> -->
      </el-col>

      <el-col>
        <!-- <el-select v-model="value" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </el-col>

      <el-col>
        <!-- <el-select v-model="value" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </el-col>

      <el-col>
        <!-- <el-select v-model="value" placeholder="请选择员工">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select> -->
      </el-col>

      <el-col>
        <el-button  icon="el-icon-search" type="success">搜索</el-button>
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
      tableData:[]
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>