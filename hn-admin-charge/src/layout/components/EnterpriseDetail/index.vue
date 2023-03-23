<template>
  <el-dialog class="nopaddingDialog" :title="title" :visible.sync="dialogShow" @close="closeDialog" width="50%"
    @closed="clear" append-to-body :close-on-press-escape="true" :close-on-click-modal="true" :destroy-on-close="true">
    <div class="header">公司基础信息</div>
    <div class="line">
      <span><h5>公司简称：</h5>{{detail.sampleName}}</span>
    </div>

    <div class="line">
      <span><h5>负责人：</h5>{{detail.contactName}}</span>
    </div>

    <div class="line">
      <span><h5>负责人电话：</h5>{{detail.contactPhone}}</span>
    </div>

    <div class="header">备注信息</div>
    <div class="line">
      {{detail.remark}}
    </div>
    <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关闭</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
  import http from '@/utils/request'
  export default {
    name: 'enterpriseDetail',
    // 传入参数
    props: {
      // "dialogShow": {
      //   type: Boolean
      // },
      // "title": {
      //   type: String
      // }
    },
    data() {
      return {
        id: null,
        total: 0,
        loading: false,
        title: '查看公司详情',
        dialogShow: false,
        detail: {}
      }
    },
    methods: {
      initDetail() {
        this.detail = {};
        http.request({
          url: '/system/enterprise/queryById/' + this.id,
          method: 'get'
        }).then(res => {
          this.detail = res.data;
          this.title = "查看公司(" + res.data.sampleName + ")详情";
          setTimeout(() => {
            this.dialogShow = true;
          }, 100);
        });
      },
      closeDialog() {
        this.dialogShow = false;
        // 向外部传递变量
        this.reset();
        // this.$emit('dialogShowChange', false)
      },
      clear() {
        this.detail = {};
        this.id = null;
      },
      init(id) {
        this.id = id;
        this.initDetail();
      }
    }
  }
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
