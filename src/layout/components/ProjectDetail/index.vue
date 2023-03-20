<template>
  <el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
    append-to-body :close-on-press-escape="true" :close-on-click-modal="true">
    <el-tabs v-model="showModelName">
      <el-tab-pane label="项目基础信息" name="first">
        <div class="header">项目基础信息</div>
        <div class="line">
          <span>
            <h5>项目编码：</h5>
            {{ detail.code }}
          </span>

          <span>
            <h5>项目名称：</h5>
            {{ detail.name }}
          </span>
        </div>

        <div class="line">
          <span>
            <h5>项目负责人：</h5>
            {{ detail.contactName }}
          </span>

          <span>
            <h5>负责人电话：</h5>
            {{ detail.contactPhone }}
          </span>
        </div>

        <div class="line">
          <span>
            <h5>工程建设地址：</h5>
            {{ detail.address }}
          </span>

          <span>
            <h5>账单日：</h5>
            {{ detail.settleDay }}号
          </span>
        </div>

        <div class="line">
          <span>
            <h5>所属公司：</h5>
            {{ detail.enterpriseName }}
          </span>

          <span>
            <h5>所属道路：</h5>
            {{ detail.roadName }}
          </span>
        </div>

        <div class="header">运营数据</div>

        <el-table :data="tableData" border style="width: auto">
          <el-table-column prop="name" label="施工单位名称">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleConstunctionView(scope.row)">{{scope.row.name}}</el-link>
            </template>
          </el-table-column>

          <el-table-column prop="deviceAmount" label="设备数量">
          </el-table-column>

          <el-table-column prop="chargingCapacity" label="累计充电量（度）">
          </el-table-column>

          <el-table-column prop="chargingPrice" label="累计充电金额(元)">
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.page" :limit.sync="queryParams.pageSize"
          @pagination="getList" :page-sizes="[5, 10, 20, 50, 100]" />
      </el-tab-pane>

      <el-tab-pane label="项目详细说明" name="second">
        <div class="line fwb">
          <h5>项目详细说明：</h5>

          <div v-html="detail.description"></div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 施工单位详情 -->
    <constunctionDetail ref="constunctionDetailRef" />
  </el-dialog>
</template>

<script>
  import http from "@/utils/request";
  export default {
    name: "projectDetail",
    // 传入参数
    props: {
      // "dialogShow": {
      //   type: Boolean
      // },
      // "title": {
      //   type: String
      // }
    },
    components: {

      constunctionDetail: () => import("@/layout/components/constunctionDetail"),
    },
    data() {
      return {
        id: null,
        total: 0,
        loading: false,
        title: "查看项目详情",
        dialogShow: false,
        queryParams: {
          page: 1,
          pageSize: 5,
          projectId: 0,
          roleKey: undefined,
          status: undefined,
          orderBy: "createTime",
          isAsc: "desc",
        },
        showModelName: "first",
        tableData: [],
        detail: {},
      };
    },
    methods: {
      //查看施工单位详情
      handleConstunctionView(row) {
        http.request({
          url: `/system/constructionEnterprise/queryById/${row.id}`,
          method: "get",
        }).then((res) => {
          this.$refs.constunctionDetailRef.open(res.data);
        });
      },
      getList() {
        this.loading = true;
        let that = this;
        http
          .request({
            url: "/system/project/queryBusinessList",
            method: "get",
            params: this.queryParams,
          })
          .then((res) => {
            that.tableData = res.rows || [];
            that.total = res.total;
            that.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      },
      initDetail() {
        this.detail = {};
        http
          .request({
            url: "/system/project/queryById/" + this.id,
            method: "get",
          })
          .then((res) => {
            this.detail = res.data;
            this.title = "查看项目(" + res.data.name + ")详情";
            setTimeout(() => {
              this.dialogShow = true;
            }, 100);
          });
      },
      initPageList() {
        this.queryParams.page = 1;
        this.total = 0;
        this.tableData = [];
        this.getList();
      },
      closeDialog() {
        this.dialogShow = false;
        // 向外部传递变量
        // this.$emit('dialogShowChange', false)
      },
      clear() {
        this.detail = {};
        this.id = null;
        this.tableData = [];
      },
      init(id) {
        this.id = id;
        this.queryParams.projectId = id;
        this.showModelName = "first";
        this.initDetail();
        this.initPageList();
      },
    },
  };
</script>

<style type="text/css">

  .line {
    line-height: 40px;
    padding: 0rpx 50px;
    padding-left: 10px;
  }

  .line+.line {
    border-top: 1px solid #eee;
  }

  .header {
    background-color: #f3f3f3;
    line-height: 40px;
    font-weight: bold;
    margin: 0px -20px;
    padding: 0px 20px;
  }

  .line span {
    display: inline-block;
    width: 50%;
  }
</style>
