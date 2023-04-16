<template>
  <div class="hn-index-main">
    首页
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin']),
  },
  mounted() {
    // 若本地缓存没有全国区域数据，则请求接口获取
    let chinaArea = JSON.parse(window.localStorage.getItem('chinaArea'))
    if (this.isEmpty(chinaArea)) {
      this.getChinaAreaList()
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>