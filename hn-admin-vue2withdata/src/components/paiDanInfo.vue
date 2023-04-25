<template>
  <div>
    <el-dialog title="派单详情" width="600px" :visible.sync="showDIDialog">
      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item">
          <span>客户姓名：</span>
          <span>{{ paiDanInfo.customName }}</span>
        </div>
        <div class="hn-pdinfo-item">
          <span>客户来源：</span>
          <span>{{ paiDanInfo.dictName }}</span>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item">
          <span>派单医院：</span>
          <span v-for="item in paiDanInfo.dispatchHospitalVoList" :key="item.hospitalId">{{ item.hospitalName }}</span>
        </div>
        <div class="hn-pdinfo-item">
          <span>派单时间：</span>
          <span>{{ paiDanInfo.dispatchTime }}</span>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item">
          <span>跟进状态</span>
          <span>{{ paiDanInfo.followStatus }}</span>
        </div>
        <div class="hn-pdinfo-item">
          <span>客户性别</span>
          <span>{{ paiDanInfo.gender==0?'女':paiDanInfo.gender==1?'男':'未知' }}</span>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item">
          <span>客户电话：</span>
          <span>{{ paiDanInfo.phone }}</span>
        </div>
        <div class="hn-pdinfo-item">
          <span>项目</span>
          <span>{{ paiDanInfo.project }}</span>
        </div>
      </div>
        
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="showDIDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props:{
    id:{
      required: true,
      type: Number
    }
  },
  data() {
    return {
      showDIDialog:false,
      paiDanInfo:{},//派单详情
    }
  },
  mounted() {

  },
  methods: {
    // 获取派单详情
    getPaiDanInfo(){
      this.request("/dispatch/getDispatchInfo",{
        dispatchId:this.id
      }).then((res)=>{
        if(res.code==0){
          this.paiDanInfo = res.data
        }
      })
    },
    open(){
      this.showDIDialog = true
      this.getPaiDanInfo()
    },
  }
}
</script>

<style scoped lang="scss">

</style>