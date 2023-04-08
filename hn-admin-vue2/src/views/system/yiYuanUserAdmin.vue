<template>
  <div class="hn-yiy-main">
    <div class="hn-power-left">
      <div class="hn-yiyml-head">
        <el-button size="small" icon="el-icon-upload">导出全部</el-button>
        <el-button size="small" icon="el-icon-plus" type="primary">新增企业</el-button>
      </div>
      <div class="hn-yiyml-search">
        <el-cascader
          :options="options"
          :props="{ checkStrictly: true }"
          clearable
          placeholder="行政区域"
          class="hn-yiymls-cas"
          size="small"
        >
        </el-cascader>
        <el-input size="small" class="hn-yiymls-inp" prefix-icon="el-icon-search" clearable placeholder="企业名称"></el-input>
      </div>
      <div class="hn-yiyml-table">
        <el-table :data="qyTableData" style="width: 100%">
          <el-table-column prop="name" label="公司名称" width="180">
          </el-table-column>
          <el-table-column prop="adres" label="行政区域" width="180">
          </el-table-column>
          <el-table-column prop="edit" label="操作">
            <template slot-scope="scope">
              <el-button style="color: red;" type="text" size="small">删除</el-button>
              <el-button type="text" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination 
          v-show="qyTotal > 0" 
          :total="qyTotal" 
          :page="qyQueryParams.page" 
          :limit="qyQueryParams.pageSize"
          layout='prev, pager, next, sizes, jumper'
          @pagination="getQYListData" 
        />
      </div>
    </div>
    <div class="hn-power-right">
      <div class="hn-yiymr-head">
        <div class="hn-yiymrh-text">xxx公司</div>
        <div class="hn-yiymrh-shbox">
          <el-input prefix-icon="el-icon-search" size="small" placeholder="姓名，账号，联系方式" class="hn-yiymrh-search"></el-input>
          <el-button size="small" icon="el-icon-plus" type="primary">新增用户</el-button>
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
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <div style="display: flex;flex-wrap: wrap;">
                <el-button type="text" size="small">修改</el-button>
                <el-button type="text" size="small">重置密码</el-button>
                <el-button type="text" size="small">关联公司</el-button>
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
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }]
          }]
        },
        {
          value: 'zhinan',
          label: '指南2',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }]
          }]
        }
      ],

      qyTableData: [{
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
      qyTotal:100,
      qyQueryParams:{
        page:1,
        pageSize:20,
      },


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
  mounted(){
    
  },
  methods: {
    getQYListData(){
      
    },
    getUserListData(){

    },
  }
}
</script>

<style scoped lang="scss">


</style>