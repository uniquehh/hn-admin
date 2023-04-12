<template>
  <div class="hn-topnav-head">
    <div class="hn-head-left">
      <div class="hn-headl-icons" @click="stSetCollapse(!isCollapse)">
        <i class="el-icon-s-fold" v-show="!isCollapse" style="font-size: 18px;" />
        <i class="el-icon-s-unfold" v-show="isCollapse" style="font-size: 18px;" />
      </div>
      <mianBaoXie></mianBaoXie>
    </div>
    <div class="hn-head-right">
      <div class="hn-avatar-icons">
        <i class="el-icon-suoping" style="font-size: 18px;margin-right: 15px;" />
        <i class="el-icon-yifu" style="font-size: 18px;margin-right: 15px;" />
        <i class="el-icon-bell" style="font-size: 18px;margin-right: 15px;" />
        <i :class="fullscreen ? 'el-icon-quxiaoquanping' : 'el-icon-quanping'" @click="handleFullScreen" style="font-size: 18px;margin-right: 15px;" />
      </div>
      <div class="hn-avatar-wrapper">
        <img :src="userInfo.headImg? userInfo.headImg :require('../assets/img/defAvatar.png')" class="hn-user-avatar">
        <div class="hn-user-name">{{ userInfo.realName }}</div>
      </div>
      <el-dropdown class="hn-avatar-box" trigger="click">
        <i class="el-icon-arrow-down" />
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="loginOut()">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import mianBaoXie from './mianBaoXie.vue'
export default {
  components:{mianBaoXie},
  data() {
    return {
      fullscreen:false,//是否全屏
    }
  },
  computed: {
    ...mapState('asideMenu', ['isCollapse']),
    ...mapState('user', ['userInfo']),
  },
  mounted() {
    
  },
  methods: {
    // 获取左侧菜单store模块
    ...mapMutations('asideMenu',['stSetCollapse']),
    // 获取用户store模块
    ...mapMutations('user', ['stSetUserInfo','stSetIsLogin']),
    logout() { },
    // 全屏
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
  }
}
</script>

<style lang="scss" scoped>
.hn-topnav-head{
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 10px 10px;
}
.hn-head-left{
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.hn-headl-icons{
  cursor: pointer;
  margin-right: 20px;
  font-size: 0;
}
.hn-user-avatar{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.hn-head-right{
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}
.hn-avatar-wrapper{
  display: flex;
  align-items: center;
}
.hn-user-name{
  margin: 0 10px;
}
</style>