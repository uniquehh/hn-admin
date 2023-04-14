<template>
  <div class="hn-staff-main">
    <div class="hn-power-right">
      <div class="hn-yiymr-head">
        <!-- <div class="hn-yiymrh-text">xxx公司</div> -->
        <div class="hn-yiymrh-shbox">
          <el-input prefix-icon="el-icon-search"  placeholder="姓名，账号，联系方式" class="hn-yiymrh-search"></el-input>
          <el-button  icon="el-icon-plus" type="primary">新增员工</el-button>
        </div>
      </div>
      <div class="hn-yiymr-table">
        <el-table :data="userTableData" style="width: 100%">
          <el-table-column prop="name" label="账号" width="100">
          </el-table-column>
          <el-table-column prop="adres" label="联系方式" width="100">
          </el-table-column>
          <el-table-column prop="name" label="真实姓名" width="180">
          </el-table-column>
          <el-table-column prop="adres" label="性别">
          </el-table-column>
          <el-table-column prop="name" label="角色权限">
          </el-table-column>
          <el-table-column prop="adres" label="禁止登录">
            <template slot-scope="scope">
              <el-switch></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <div style="display: flex;flex-wrap: wrap;">
                <el-button type="text" >修改</el-button>
                <el-button type="text" >重置密码</el-button>
                <el-button type="text" >关联公司</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="userTotal > 0" 
          :total="userTotal" 
          :page="userQueryParams.page" 
          :limit="userQueryParams.pageSize"
          layout='prev, pager, next, sizes, jumper'
          @pagination="getUserListData" 
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userTableData: [{
        name: '2016-05-02',
        adres: '王小虎',
        edit: '上海市普陀区金沙江路 1518 弄'
      }, {
        name: '2016-05-02',
        adres: '王小虎',
        edit: '上海市普陀区金沙江路 1518 弄'
      }, {
        name: '2016-05-02',
        adres: '王小虎',
        edit: '上海市普陀区金沙江路 1518 弄'
      }],
      userTotal:100,
      userQueryParams:{
        page:1,
        pageSize:20,
      }
    }
  },
  mounted() {

  },
  methods: {
    getUserListData(){

    },
  }
}
</script>

<style scoped lang="scss">

</style>