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
    // console.log(this.userInfo,789)
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>