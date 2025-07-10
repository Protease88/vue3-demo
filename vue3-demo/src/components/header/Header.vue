<template>
  <el-page-header @back="goBack">
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
    <el-dropdown>
        <span class="el-dropdown-link">
          admin
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="backLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
  </el-page-header>
  
</template>



<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'
import {useRouter} from 'vue-router'

const goBack = () => {
  console.log('go back')
}

const router = useRouter()


const backLogin=()=>{
  router.push('/login')
}
</script>

 <style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.el-dropdown {
  margin-left: auto;
}
.el-page-header {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直居中 */
}
</style> 
<!-- <style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
.el-dropdown {
  margin-left: auto;
}
.el-page-header {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直居中 */
}
</style>
-->