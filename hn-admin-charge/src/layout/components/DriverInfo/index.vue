<template>
  <!-- :visible.sync="detailShow" -->
  <el-dialog
    width="50%"
    title="司机基本信息"
    :visible.sync="diaLogShow"
    append-to-body
  >
    <div class="line header" style="margin-top: -30px">
      姓名：{{ driverInfo.name }}
    </div>

    <div class="line">
      头像：<img
        class="avatar"
        :src="driverInfo.headImage ? driverInfo.headImage : ''"
        alt=""
      />
    </div>

    <div class="line">
      <div>年龄：<span>{{ driverInfo.age ? driverInfo.age : "" }}</span></div>
      <div>性别：<span>{{ driverInfo.sex ? "女" : "男" }}</span></div>
    </div>

    <div class="line">
      <div>电话：<span>{{ driverInfo.phone }}</span></div>
      <div>账号状态：<span>{{ driverInfo.status ? "冻结" : "正常" }}</span></div>
    </div>

    <div class="line"><div>所属道路名称：<span>{{ driverInfo.roadName }}</span></div></div>

    <div class="line"><div>所属公司名称：<span>{{ driverInfo.enterpriseName }}</span></div></div>

    <div class="line"><div>所属项目名称：<span>{{ driverInfo.projectName }}</span></div></div>

    <div class="line header">关联车辆信息：</div>

        <el-table :data="driverOwnerList" border style="width: auto">
          <el-table-column prop="code" label="设备编码">
          </el-table-column>

          <el-table-column prop="name" label="设备名称">
          </el-table-column>

          <el-table-column prop="classification" label="所属分类">
          </el-table-column>

          <el-table-column prop="projectName" label="所属项目">
            <template slot-scope="scope">
            <el-link type="primary" @click="viewProject(scope.row)">{{ scope.row.projectName }}</el-link>
          </template>
          </el-table-column>

          <el-table-column prop="constructionEnterpriseName" label="所属施工单位">
            <template slot-scope="scope">
            <el-link type="primary" @click="viewConstunction(scope.row)">{{ scope.row.constructionEnterpriseName }}
            </el-link>
          </template>
          </el-table-column>

          <el-table-column prop="accessFlag" label="车辆状态">
            <template slot-scope="scope">
              {{scope.row.accessFlag==1?'进场':'离场'}}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="driverOwnerList.length > 0" :total="driverOwnerList.length" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
          @pagination="getOwnerList" :page-sizes="[5, 10, 20, 50, 100]" />

        <projectDetail ref="projectDetail" />
        <constunctionDetail ref="constunctionDetail" />
  </el-dialog>
  
</template>

<script>
import { getListOneInfo,getDriverOwnerList } from "@/api/driverManagement/driver";
import request from "@/utils/request";

export default {
 components: {
		projectDetail: () => import('@/layout/components/ProjectDetail'),
		constunctionDetail: () => import('@/layout/components/constunctionDetail')
	},
  data() {
    return {
      title: "司机基础信息",
      diaLogShow: false,
      driverInfo: {
        age: 0,
        chargingCapacity: 0,
        chargingPrice: "",
        createTime: "",
        deviceAmount: "",
        enterpriseId: "",
        headImage: 0,
        id: "",
        name: 0,
        phone: 0,
        projectCode: "",
        projectId: 0,
        projectName: 0,
        roadId: "",
        sex: "",
        status: 0,
        roadName:"",
        enterpriseName:"",
        projectName:""
      },
      queryParams: {
          page: 1,
          pageSize: 5,
          driverId: 0,
          orderBy: "t.create_time",
          isAsc: "desc",
        },
      driverOwnerList:[]
    };
  },
    methods: {
    getDinfo(id) {
      this.$nextTick(() => {
        this.diaLogShow = true;
        this.driverInfo = {
          age: 0,
          chargingCapacity: 0,
          chargingPrice: "",
          createTime: "",
          deviceAmount: "",
          enterpriseId: "",
          headImage: 0,
          id: "",
          name: 0,
          phone: 0,
          projectCode: "",
          projectId: 0,
          projectName: 0,
          roadId: "",
          sex: "",
          status: 0,
          roadName:"",
          enterpriseName:"",
          projectName:""
        };
        getListOneInfo(id).then((res) => {
          this.driverInfo = res.data;
        });
        this.queryParams.driverId = id
        this.getOwnerList()
      });
    },

    getOwnerList(){
        this.driverOwnerList=[]
        console.log(this.queryParams,'[][][[]')
        getDriverOwnerList(this.queryParams).then((res)=>{
          res.rows.forEach((item)=>{
            item.classification = item.firstName + '-' + item.sencondName + '-' + item.thirdName
          })
          this.driverOwnerList = res.rows
        })
    },

    viewProject(row) {
      this.$refs.projectDetail.init(row.projectId);
    },
    viewConstunction(row) {
      return request({
        url: `/system/constructionEnterprise/queryById/${row.constructionEnterpriseId}`,
        method: "get",
      }).then((res) => {
        this.$refs.constunctionDetail.open(res.data);
      });

    },

  },
};
</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 20px 0;
}

.line {
  line-height: 50px;
  border-bottom: 1px solid #eee;
  padding: 0rpx 50px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.line div {
  flex: 1;
  font-weight: bold;
}

.line div span {
  font-weight: normal;
}

.header {
  background-color: #f3f3f3;
  font-weight: bold;
  margin: 0px -20px;
  padding: 0px 20px;
}
</style>
