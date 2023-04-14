<template>
  <div class="hn-dtdict-main">
    <el-tabs v-model="activeName" @tab-click="tabsChange">
      <div class="hn-dict-search">
        <div class="hn-dicts-left">
          <div class="hn-dictsl-text">字典名称：</div>
          <el-input  class="hn-dictsl-inp"></el-input>
        </div>
        <div class="hn-dicts-right">
          <el-button >重置</el-button>
          <el-button  type="primary">搜索</el-button>
        </div>
      </div>
      <el-tab-pane v-for="(item) in dictType" :key="item.dictType" :label="item.label" :name="item.dictType">
        <dictTable 
          v-if="activeName == item.dictType" 
          :key="activeName" 
          :data="item.list._list" 
          :paging="paging"
          @pagingParent="pagingChange"
        ></dictTable>

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
      dictType: [ //字典类型
        {
          dictType: "CUSTOMER_SOURCE",
          label: "客户来源",
          list: new Paging('/dict/getDictPage', { dictName: "",order:"id DESC" },'post'),//字典数据
        },
      ],
      activeName: 'CUSTOMER_SOURCE',
      paging: {
        page: 1,
        pageSize: 20,
      }
    }
  },
  computed: {
    currDTInd() {
      return this.dictType.findIndex(item=> item.dictType == this.activeName)
    }
  },
  created() {
    this.getDictData()
  },
  mounted() {

  },
  methods: {
    // 获取数据字典分页数据
    getDictData() {
      this.dictType[this.currDTInd].list._params.dictType = this.activeName
      this.dictType[this.currDTInd].list.exec()
    },
    // 初始化分页、关键词数据
    resetPaging(ind) {
      this.dictType[ind].list._page = 1
      this.dictType[ind].list._limit = 20
    },
    // 重置按钮
    resetBtnEvent() {

    },
    pagingChange(e,ind) {
      // this.dictType[ind].list._params.page = e.page
      // this.dictType[ind].list._params.pageSize = e.limit
      // console.log(this.dictType[ind])

    },
    tabsChange(tab) {
      // this.resetPaging(tab.index)
      console.log(this.activeName)
      console.log(tab.index, tab.name)
    }
  }
}
</script>

<style scoped lang="scss"></style>