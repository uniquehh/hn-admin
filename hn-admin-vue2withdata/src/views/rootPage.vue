<template>
  <div class="page">
    <div class="hn-rtpage-box" v-show="isLogin">
      <!-- 左侧菜单区域 -->
      <div class="hn-rtpage-aside">
        <asideMenu></asideMenu>
      </div>
      <!-- 右侧内容区域 -->
      <div class="hn-rtpage-main" v-if="$route.name!='index'">
      <!-- <div class="hn-rtpage-main"> -->
        <div class="hn-topnav-box">
          <!-- 顶部导航功能区域 -->
          <topNavHead></topNavHead>
          <!-- 顶部导航横向菜单区域 -->
          <topNavMenus></topNavMenus>
        </div>
        <div class="hn-cont-box">
          <div class="hn-cont-main">
            <div class="hn-contm-bg"><router-view></router-view></div>
          </div>
        </div>
      </div>
      <div class="hn-rtpage-main" v-if="$route.name=='index'">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import asideMenu from '@/components/asideMenu.vue';
import topNavHead from '@/components/topNavHead.vue';
import topNavMenus from '@/components/topNavMenus.vue';
export default {
  components:{asideMenu,topNavHead,topNavMenus},
  data() {
    return {

    }
  },
  computed: {
    ...mapState('user', ['isLogin']),
  },
  created() {

  },
  mounted() {
    
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.hn-rtpage-box{
  display: flex;
}
/* 左侧菜单容器 */
.hn-rtpage-aside{
  background-color: #202124;
  height: 100vh;
}
/* 右侧内容区域 */
.hn-rtpage-main{
  flex: 1;
  height: 100vh;
  width: calc(100% - 200px); //使得内部内容宽度超出后出现滚动条
  background-color: #F6F6F6;
}
.hn-cont-box{
  padding: 10px;
}
.hn-cont-main{
  height: calc(100vh - 108px);
  overflow: auto;
}
.hn-contm-bg{
  background-color: white;
  border-radius: 5px;
  height: 100%;
  ::v-deep .rowbg{
    background-color: #F5F7FA;
  }
}

</style>
