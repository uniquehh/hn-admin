<template>
  <div class="page">
    <router-view v-slot="{Component}">
      <component :is="Component"></component>
    </router-view>
  </div>
</template>
<script>


</script>

<style>
/* 主题颜色 #4E72ED */
*{margin: 0;padding: 0;}
/* .page{
  font-family: ;
} */
.el-menu-item:hover{
  background-color: #007ACC !important;
}
.el-sub-menu__title:hover{
  background-color: #007ACC !important;
}


</style>
