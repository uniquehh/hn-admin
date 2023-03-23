<template>
    <div>
      <label class="tital_data">数据统计</label>
      <el-row style="height:100px;padding:10px 10px 0px;margin-bottom:10px;">
        <el-col :span="column.width"  class="number_col" v-for="(column,index) in columnArray" v-if="!column.hidden">
          <div class="grid-content bg-purple">
            <span><font size="5">{{column.value===null?0:column.value}}</font>
              <br> {{column.label}}</span>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  export default {
    name: 'easyStatis',
    props:{
      columnArray:{
        type:Array,
        default:[]
      }
    }
  }
</script>

<style scoped lang="scss">
  .tital_data{
    font-size: 14px;
    font-weight: 700;
    margin-left:10px;
    color: #56585c;
  }
  .number_col{
    height:100%;
    text-align: center;

    div{
      text-align: center;
      font-weight: bolder;
      font-size: 18px;
      padding-top:10px;
    }
  }
  .number_col:nth-child(1){
    margin:0px 10px 0px 10px;
    background-color: rgba(0, 204, 255, 1)
  }
  .number_col:nth-child(2) {
    margin:0px 10px 0px 10px;
    background-color: rgba(0, 204, 0, 1);
  }
  .number_col:nth-child(3) {
    margin:0px 10px 0px 10px;
    background-color: rgba(204, 153, 0, 1);
  }
  .number_col:nth-child(4){
    margin:0px 10px 0px 10px;
    background-color: rgba(0, 204, 255, 1)
  }
  .number_col:nth-child(5) {
    margin:0px 10px 0px 10px;
    background-color: rgba(0, 204, 0, 1);
  }
  .number_col:nth-child(6) {
    margin:0px 10px 0px 10px;
    background-color: rgba(204, 153, 0, 1);
  }
</style>
