<template>
  <div class="foot">版权所有：西安邮电大学 2011-{{ currentYear }} 中国西安长安南路563号  
    <a href="https://beian.miit.gov.cn/" target="_blank">陕ICP备05001585号-1</a> 
  </div>
</template>

<script setup lang="ts">
  const currentYear = new Date().getFullYear()
</script>

<style>

</style>