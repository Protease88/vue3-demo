<template>

<RouterView/>


</template>

<script setup lang="ts">
 import LoginView from './views/LoginView.vue';
</script>

<style>
/* 在全局样式文件（如App.vue或main.css）中添加 */
html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  /* overflow: hidden; */
}
#app {
    padding: 0 !important;
    margin: 0 !important;
}
</style>