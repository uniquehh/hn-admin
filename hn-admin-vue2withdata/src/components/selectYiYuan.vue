<template>
  <div class="hn-selectyy-main">
    <el-cascader
      v-model="selectVals"
      :props="selectYYProps"
      :options="chinaArea"
      placeholder="请选择医院"
      @expand-change="getAreaByParent"
      @change="editAreaChange"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectVals:[],
      selectYYProps:{
        value:'id',
        label:'name',
        children:'child',
      },
      chinaArea:[],
      currProvIndex:"",//当前操作得区省级区域下标
      currCityIndex:"",//当前操作得城市下标
      currCityCodeHistory:[],//当前已获取过得城市医院得citycode记录
      historyEditYYIds:[],//当前已获取过得城市医院得id记录
    }
  },
  created(){
    this.getAreaData()
  },
  methods: {
    // 点击组件时父组件需要调用open方法
    open(type,row){
      type=='edit'?this.editCDHXForm(row):this.selectVals=[]
    },
    // 选择的医院
    editAreaChange(val){
      console.log(val)
    },
    async getAreaData(){
      // 若本地缓存没有全国区域数据，则请求接口获取
      this.chinaArea = JSON.parse(window.localStorage.getItem('chinaArea')) || await this.getChinaAreaList()
    },
    async getCityByProv(pccode){
      let temp = this.currCityCodeHistory.find(item=>item==pccode)
      // 若已经获取过该省份下得城市数据，则不再获取
      if(temp)return;
      this.currCityCodeHistory.push(pccode)
      let res = await this.getChinaAreaList({
        level:'1',
        cityCode:pccode
      })
      res.forEach(item=>item.child=[])
      this.chinaArea[this.currProvIndex].child = res
    },
    // 获取城市、医院
    async getAreaByParent(val){
      console.log(val,756)
      
      if(val.length==1){
        this.currProvIndex = this.chinaArea.findIndex(item=>item.id==val[0])
        this.getCityByProv(this.chinaArea[this.currProvIndex].cityCode)
      }

      if(val.length==2){
        this.currCityIndex = this.chinaArea[this.currProvIndex].child.findIndex(item=>item.id==val[1])
        let ccode = this.chinaArea[this.currProvIndex].child[this.currCityIndex].cityCode
        this.chinaArea[this.currProvIndex].child[this.currCityIndex].child = await this.getHospitalByCity(ccode)
      }
      
    },
    // 获取城市下得医院
    getHospitalByCity(ccode){
      return new Promise((rs,rj)=>{
        this.request('/hospital/getHospitalPage',{
          limit:200,
          page:1,
          cityCode:ccode,
          order:'id DESC'
        },'post').then((res)=>{
          if(res.code==0){
            rs(res.data)
          }else{
            rj(res)
          }
        })
      })
    },
    async editCDHXForm(row){
      // 若历已点击过就该，代表该医院数据已存在，不需要重新获取
      // console.log(this.historyEditYYIds)
      if(!this.historyEditYYIds.includes(row.id)){
        this.historyEditYYIds.push(row.id)
        // 获取城市数据
        let res = await this.getChinaAreaList({
          level:'1',
          cityCode:row.cityCode.slice(0,2)
        })
        res.forEach(item=>item.child = [])
        // 将城市数据给对应的省份
        let pindex = this.chinaArea.findIndex(item=>item.cityCode==row.cityCode.slice(0,2))
        this.chinaArea[pindex].child = res
        // 获取医院数据并给到对应的城市
        let cindex = this.chinaArea[pindex].child.findIndex(item=>item.cityCode==row.cityCode)
        let res2 = await this.getHospitalByCity(row.cityCode)
        this.chinaArea[pindex].child[cindex].child = res2
        let yyid = this.chinaArea[pindex].child[cindex].child.find(item=>item.id==row.hospitalId).id
        
        let hids = [this.chinaArea[pindex].id,this.chinaArea[pindex].child[cindex].id,yyid]
        this.selectVals = hids
      }else{
        let pindex = this.chinaArea.findIndex(item=>item.cityCode==row.cityCode.slice(0,2))
        let cindex = this.chinaArea[pindex].child.findIndex(item=>item.cityCode==row.cityCode)
        let yyid = this.chinaArea[pindex].child[cindex].child.find(item=>item.id==row.hospitalId).id
        let hids = [this.chinaArea[pindex].id,this.chinaArea[pindex].child[cindex].id,yyid]
        this.selectVals = hids
      }
      
      console.log(this.selectVals)
      
    },


  }
}
</script>

<style scoped lang="scss">

</style>