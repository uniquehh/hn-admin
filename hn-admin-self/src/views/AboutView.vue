<template>
  <div class="about">
    <h1 v-hasPower="['1234']">This is an about page</h1>
  </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue'
let { proxy } = getCurrentInstance()
// proxy.$axios('asd/fff', { a: 1, b: "" })
</script>