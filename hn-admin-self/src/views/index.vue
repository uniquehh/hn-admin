<template>
  <div class="page">
    <div class="hn-index-box">
      <!-- 左侧菜单区域 -->
      <div class="hn-index-aside">
        <asideMenu></asideMenu>
      </div>
      <!-- 右侧内容区域 -->
      <div class="hn-index-main">
        <div class="hn-topnav-box">
          <!-- 顶部导航功能区域 -->
          <topNavHead></topNavHead>
          <!-- 顶部导航横向菜单区域 -->
          <topNavMenus></topNavMenus>
        </div>
        <div class="hn-cont-box">

        </div>



      </div>
    </div>
  </div>
</template>

<script setup>
import asideMenu from '@/components/asideMenu.vue';
import topNavHead from '@/components/topNavHead.vue';
import topNavMenus from '@/components/topNavMenus.vue';



</script>
<style scoped>
.hn-index-box{
  display: flex;
}
/* 左侧菜单容器 */
.hn-index-aside{
  background-color: #252526;
  height: 100vh;
}
/* 右侧内容区域 */
.hn-index-main{
  flex: 1;
  height: 100vh;
  background-color: #f8f8f8;
}
</style>
