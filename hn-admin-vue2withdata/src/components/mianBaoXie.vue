<template>
  <div class="hn-mbxie-main">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in mianBaos" :key="item.id">
      {{ item.name }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('mianBaoXie',['mianBaos']),
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">

</style>