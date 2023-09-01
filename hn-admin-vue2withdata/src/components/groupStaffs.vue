<template>
  <el-drawer :title="groupName+'的成员'" :visible.sync="drawer">
    <div class="hn-xzcy-main">
      <div class="hn-yiymrh-shbox">
        <el-input class="hn-yiymrh-search hn-mrr10" prefix-icon="el-icon-search" @keyup.enter.native="inputSearch" v-model="list._params.searchValue" placeholder="姓名、电话号码"></el-input>
        <el-button @click="resetSearch">重置</el-button>
        <el-button icon="el-icon-search" @click="inputSearch" type="primary">搜索</el-button>
      </div>
      <div class="hn-yiymr-table">
        <el-table :data="list._list" style="width: 100%">
          <el-table-column prop="phone" label="手机号">
          </el-table-column>
          <el-table-column prop="realName" label="真实姓名">
          </el-table-column>
          <el-table-column label="角色权限">
            <template slot-scope="scope">
              <span v-if="scope.row.roleVo">{{ scope.row.roleVo.roleAlias }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="list._total > 0" 
          :total="list._total" 
          :page="list._page" 
          :limit="list._limit"
          layout='total, prev, pager, next, sizes, jumper'
          @pagination="pagingChange" 
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { Paging } from '@/util/paging'
export default {
  props:{
    groupId:{
      type:Number,
      default:0
    },
    groupName:{
      type:String,
      default:""
    },
  },
  data() {
    return {
      drawer:false,
      list: new Paging('/user/getUserPage', { groupId:"",searchValue: "",order:"id DESC" },'post'),
      draTitle:"",
    }
  },
  watch:{
    groupId(val){
      if(val){
        this.list._params.groupId = val
      }
    },
    groupName(val){
      if(val){
        this.draTitle = val
      }
    },

  },
  methods: {
    open(){
      this.drawer = true
      this.$nextTick(()=>{
        this.getUserListData()
      })
    },
    // 重置搜索
    resetSearch(){
      this.list._params.searchValue = ''
      this.getUserListData()
    },
    // 输入框搜索
    inputSearch(){
      this.resetPaging()
      this.getUserListData()
    },
    // 获取用户数据
    getUserListData(){
      if(this.list._params.groupId==0)return;
      this.list.exec()
    },
    // 重置页数
    resetPaging(){
      this.list._page = 1
      this.list._limit = 20
    },
    // 页数发生改变
    pagingChange(e){
      this.list._page = e.page
      this.list._limit = e.limit
      this.getUserListData()
    },
  }
}
</script>

<style scoped lang="scss">
.hn-yiymrh-shbox{
  align-items: center;
  justify-content: unset;
}
</style>