<template>
  <div class="hn-power-main">
    <div class="hn-power-left">
      <div class="hn-powerl-head">
        <div class="hn-powerlh-item">
          <div class="hn-powerlhi-text">所属角色</div>
          <i class="hn-powerlhi-icon el-icon-circle-plus-outline"></i>
        </div>
      </div>
      <div class="hn-powerl-cont">
        <div class="hn-powerlc-item">
          超级管理员
        </div>
      </div>
    </div>
    <div class="hn-power-right">
      <div class="hn-powerr-head">
        权限列表
      </div>
      <div class="hn-powerr-cont">
        <div class="hn-powerrc-item">
          <div class="hn-powerrci-parent">
            <el-checkbox>企业总览</el-checkbox>
          </div>
          <el-checkbox-group v-model="checkedCities">
            <div class="hn-powerrci-child" v-for="city in cities" :key="city">
              <el-checkbox :label="city" >{{ city }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkedCities: ['上sssss海', '北京'],
      cities: ['上sssss海', '北京', '广州', '深圳', '深圳s', '深圳a', '深圳d'],
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>