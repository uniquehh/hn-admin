<template>
  <div class="hn-topnav-head">
    <el-icon><Fold /></el-icon>
    <el-icon><Expand /></el-icon>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Fold,
  Expand,
} from '@element-plus/icons-vue'
</script>

<style scoped>
.hn-topnav-head{
  background-color: white;
  display: flex;
}
</style>