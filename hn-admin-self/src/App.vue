<template>
  <div class="page">
    <router-view v-slot="{Component}">
      <component :is="Component"></component>
    </router-view>
  </div>
</template>
<script setup>


</script>

<style>
*{margin: 0;padding: 0;}
.el-menu-item:hover{
  background-color: #007ACC !important;
}
.el-sub-menu__title:hover{
  background-color: #007ACC !important;
}
</style>
