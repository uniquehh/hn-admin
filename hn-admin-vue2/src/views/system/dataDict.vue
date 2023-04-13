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
        <dictTable v-if="activeName=='first'" :key="activeName" :data="dictData._list" :paging="paging" @pagingParent="pagingChange"></dictTable>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <dictTable v-if="activeName == 'second'" :key="activeName" :data="dictData._list" :paging="paging" @pagingParent="pagingChange"></dictTable>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
        <dictTable v-if="activeName == 'third'" :key="activeName" :data="dictData._list" :paging="paging" @pagingParent="pagingChange"></dictTable>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">
        <dictTable v-if="activeName == 'fourth'" :key="activeName" :data="dictData._list" :paging="paging" @pagingParent="pagingChange"></dictTable>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dictTable from '@/components/dictTable.vue'
import { Paging } from '@/util/paging'
export default {
  components: { dictTable },
  data() {
    return {
      dictData: new Paging('/abc',{page:1,pageSize:20,keyword:""}),
      activeName: 'first',
      paging: {
        page: 1,
        pageSize:20,
      }
    }
  },
  mounted() {

  },
  methods: {
    // 初始化分页、关键词数据
    resetPaging() {
      this.dictData._params.page = 1
      this.dictData._params.pageSize = 20
    },
    // 重置按钮
    resetBtnEvent() {

    },
    pagingChange(e) {
      console.log(e.page, e.limit)
      this.dictData._params.page = e.page
      this.dictData._params.pageSize = e.limit
      console.log(this.dictData)
      
    },
    handleClick(tab) {
      this.resetPaging()
      console.log(this.dictData)
      console.log(this.activeName)
      console.log(tab.index,tab.name)
      if (this.activeName == 'first') { }
    }
  }
}
</script>

<style scoped lang="scss"></style>