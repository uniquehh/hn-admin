<template>
  <div class="hn-dtdict-table">
    <div class="hn-dtdictt-main">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="dictName" label="字典名称">
        </el-table-column>
        <el-table-column prop="dictType" label="字典类型">
          <template slot-scope="scope">
            <span>{{ dTypeText }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="form" label="字典属于">
        </el-table-column> -->
        <el-table-column prop="dictUse" label="字典是否正在使用">
          <template slot-scope="scope">
            <span>{{ scope.row.dictUse?'使用中':'未使用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="字典是否禁用">
          <template slot-scope="scope">
            <el-switch 
              :value="!scope.row.dictBlock"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
            <span v-show="!scope.row.dictBlock">启用中</span>
            <span v-show="scope.row.dictBlock">已禁用</span>
          </template>
        </el-table-column>
        <el-table-column prop="edit" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editDictRow(scope,'delete')">删除</el-button>
            <el-button type="text" @click="editDictRow(scope,'edit')">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    dictType: {
      type: Array,
      default() {
        return []
      }
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!this.isEmpty(val)) {
          this.tableData = JSON.parse(JSON.stringify(val))
          this.dTypeText = this.dictTypeText(this.tableData[0].dictType)
        }else{
          this.tableData = []
        }
      },
    },
  },
  data() {
    return {
      tableData: [],
      dTypeText:"",//字典类型中文名称
    }
  },
  created(){
    
  },
  mounted() {

  },
  methods: {
    // 编辑/删除字典数据
    editDictRow(scope,type){
      scope.row.editType = type
      this.$emit("editDictRow",this.toJSON(scope))
    },
    // 是否禁用
    handleStatusChange(row){
      this.hnMsgBox("您确定要执行此操作吗？").then(()=>{
        let ind = this.tableData.findIndex(item=>item.id==row.id)
        this.request("/dict/isForbidDict",{
          dictBlock:!this.tableData[ind].dictBlock,
          dictId:this.tableData[ind].id
        }).then((res)=>{
          if(res.code==0){
            this.tableData[ind].dictBlock = !row.dictBlock
            this.hnMsg()
          }
        })
      })
    },
    // 根据传入的英文字典类型解析出其中文名称
    dictTypeText(dtype){
      return this.dictType.find(item=>item.dictType==dtype).label
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