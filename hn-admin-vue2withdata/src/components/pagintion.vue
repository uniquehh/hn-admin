<template>
  <div class="hn-pagin-main">
    <el-pagination
      :background="background"
      :total="total"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :layout="layout"
    >
    </el-pagination>
  </div>
</template>

<script>
/**
 * 
 * 使用例子
 * <pagination 
    v-show="total > 0" 
    :total="total" 
    :page="queryParams.page" 
    :limit="queryParams.pageSize"
    @pagination="getListData" 
    />


    data() {
    return {
      total:100,
      queryParams:{
        page:1,
        pageSize:20,
      }
    }
  },

  methods: {
    getListData(e){
      this.queryParams.page = e.page
      this.queryParams.pageSize = e.limit
    }
  }
 * 
 */


export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    // 移动端页码按钮的数量端默认值5
    pagerCount: {
      type: Number,
      default: document.body.clientWidth < 992 ? 5 : 7
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, sizes, jumper'
    },
    background: { //分页按钮是否带背景色
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    };
  },
  computed: {
    currentPage(){
      return this.page
    },
    pageSize(){
      return this.limit
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
    }
  }
}
</script>

<style lang="scss" scoped>
.hn-pagin-main{
  padding: 10px 0;
  display: flex;
  justify-content: flex-end;
}
</style>
