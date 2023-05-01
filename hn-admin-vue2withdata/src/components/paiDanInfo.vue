<template>
  <div>
    <el-dialog title="派单详情" width="700px" :visible.sync="showDIDialog">
      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item hn-mrr40">
          <div class="hn-pdinfoi-th">客户姓名：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.customName }}</div>
        </div>
        <div class="hn-pdinfo-item">
          <div class="hn-pdinfoi-th">客户来源：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.dictName }}</div>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item hn-mrr40">
          <div class="hn-pdinfoi-th">派单医院：</div>
          <div class="hn-pdinfoi-td">
            <span v-for="item in paiDanInfo.dispatchHospitalVoList" :key="item.hospitalId">{{ item.hospitalName }}&nbsp;</span>
          </div>
        </div>
        <div class="hn-pdinfo-item">
          <div class="hn-pdinfoi-th">派单时间：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.dispatchTime }}</div>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item hn-mrr40">
          <div class="hn-pdinfoi-th">跟进状态：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.followStatus }}</div>
        </div>
        <div class="hn-pdinfo-item">
          <div class="hn-pdinfoi-th">客户性别：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.gender==0?'女':paiDanInfo.gender==1?'男':'未知' }}</div>
        </div>
      </div>

      <div class="hn-fitem-box">
        <div class="hn-pdinfo-item hn-mrr40">
          <div class="hn-pdinfoi-th">客户电话：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.phone }}</div>
        </div>
        <div class="hn-pdinfo-item">
          <div class="hn-pdinfoi-th">项目：</div>
          <div class="hn-pdinfoi-td">{{ paiDanInfo.project }}</div>
        </div>
      </div>
        
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="showDIDialog = false">确定</el-button>
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
  watch:{
    id(val){
      if(val){
        this.getPaiDanInfo()
      }
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
      
    },
  }
}
</script>

<style scoped lang="scss">
.hn-fitem-box{
  margin-bottom: 20px;
  // justify-content: unset;
}
.hn-mrr40{
  margin-right: 40px;
}
.hn-pdinfo-item{
  display: flex;
}
.hn-pdinfoi-th{
  width: 100px;
  white-space: nowrap;
  text-align: right;
}
.hn-pdinfoi-td{
  width: 200px;
  word-wrap: break-word;
}
</style>