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
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {

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