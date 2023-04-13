<template>
  <div class="hn-dtdict-table">
    <div class="hn-dtdictt-head">
      <div class="hn-dict-search">
        <div class="hn-dicts-left">
          <div class="hn-dictsl-text">字典类型</div>
        </div>
        <div class="hn-dicts-right">
          <el-button size="small" icon="el-icon-upload">导出全部</el-button>
          <el-button size="small" type="primary">添加数据字典</el-button>
        </div>
      </div>
    </div>
    <div class="hn-dtdictt-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="字典名称" width="180">
        </el-table-column>
        <el-table-column prop="type" label="字典类型" width="180">
        </el-table-column>
        <el-table-column prop="form" label="字典属于">
        </el-table-column>
        <el-table-column prop="useing" label="字典是否正在使用">
        </el-table-column>
        <el-table-column prop="ban" label="字典是否禁用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ban"></el-switch>
            <span v-show="scope.row.ban">启用中</span>
            <span v-show="!scope.row.ban">已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="edit" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small">删除</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- @pagination="" 组件使用组件时需要再父组件使用该emit事件才能取到值 -->
      <pagination v-show="total > 0" 
        :total="total" 
        :page="queryParams.page" 
        @pagination="pagingChange"
        :limit="queryParams.pageSize"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    paging: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    data: {
      deep: true,
      immediate:true,
      handler(val) {
        console.log(val)
        if (val) {
          this.tableData = val
        }
      },
    },
    paging: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          Object.assign(this.queryParams, val)
        }
      },
    },

  },
  data() {
    return {
      tableData: [],
      total: 100,
      queryParams: {
        page: 1,
        pageSize: 20,
      }
    }
  },
  mounted() {

  },
  methods: {
    pagingChange(e) {
      this.$emit("pagingParent",e)
    },
  }
}
</script>

<style scoped lang="scss">
.hn-dtdict-table {
  ::v-deep .el-table .cell {
    display: flex;
    align-items: center;
  }

  ::v-deep .el-switch__core {
    margin-right: 5px;
  }
}

.hn-dict-search {
  margin-bottom: 10px;
}
</style>