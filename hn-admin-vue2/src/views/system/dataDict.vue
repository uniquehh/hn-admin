<template>
  <div class="hn-dtdict-main">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <div class="hn-dict-search">
        <div class="hn-dicts-left">
          <div class="hn-dictsl-text">字典名称：</div>
          <el-input size="small" class="hn-dictsl-inp"></el-input>
        </div>
        <div class="hn-dicts-right">
          <el-button size="small">重置</el-button>
          <el-button size="small" type="primary">搜索</el-button>
        </div>
      </div>
      <el-tab-pane label="用户管理" name="first">
        <dictTable></dictTable>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dictTable from '@/components/dictTable.vue'
export default {
  components:{dictTable},
  data() {
    return {
      dicts:[],
      activeName: 'first'
    }
  },
  mounted() {
    
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped lang="scss">

</style>