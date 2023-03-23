<template>
      <div class="app-container">
        <el-table
          v-if="refreshTable"
          v-loading="loading"
          :data="dataList"
          border
          row-key="id"
          :default-expand-all="isExpandAll"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column prop="name" label="区域" :show-overflow-tooltip="true" >
            <template slot-scope="scope">
              <span> {{ scope.row.name}}</span>
              <span style="color:red;" v-if="scope.row.defaultStatus===0"> (默认)</span>
            </template>
          </el-table-column>
          <el-table-column prop="icon" label="校区数量" align="center" >
            <template slot-scope="scope">
              <span> {{ scope.row.compusNum}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="开启状态"  >
            <template slot-scope="scope" v-if="scope.row.level === 2">
              <span>{{statusOpe[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding" width="250">
            <template slot-scope="scope" v-if="scope.row.level === 2">
              <el-button
                v-if="scope.row.status === 1"
                size="mini"
                type="primary"
                icon="el-icon-edit"
                v-hasPermi="['baseSetting:area:status']"
                @click="handleAdd(scope.row)"
              >开启</el-button>
              <el-button
                v-if="scope.row.status === 0"
                size="mini"
                type="danger"
                icon="el-icon-edit"
                v-hasPermi="['baseSetting:area:status']"
                @click="handleClose(scope.row)"
              >关闭</el-button>
              <el-button
                v-if="scope.row.status === 0"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="setDefalutData(scope.row)"
                v-hasPermi="['baseSetting:area:edit']"
              >设置默认</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
</template>

<script>
  import { areaList,editStatus,editDefultStatus } from '@/api/baseSetting/area';
  import AddArea from './form/index'

  export default {
    name: 'index',
    components: { AddArea },
    data(){
      return {
        title:'',
        id:'',
        addAreaOpen:false,
        statusOpe:{0:'开启',1:'关闭'},
        refreshTable: true,
        loading: true,
        dataList:[],
        isExpandAll: false,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList(){
        this.loading = true;
        areaList(this.queryParams).then(response => {
          this.dataList = this.handleTree(response.rows,"id","pid");
          this.loading = false;
        });
      },
      handleAdd(row){
        let id = [row.id] || this.ids;
        this.$modal.confirm('是否确认开启城市？').then(function() {
          return editStatus({id:id,status:0})
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('开启成功')
        }).catch(() => {
        })
      },
      handleClose(row){
        let id = [row.id] || this.ids;
        this.$modal.confirm('是否确认关闭城市？').then(function() {
          return editStatus({id:id,status:1})
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('关闭成功')
        }).catch(() => {
        })
      },
      setDefalutData(row){
        let id = row.id
        this.$modal.confirm('是否确认将所选城市设为默认城市？').then(function() {
          return editDefultStatus(id)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('设置成功')
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped>

</style>
