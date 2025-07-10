<template>
  <el-container>
  <el-aside width="200px">
    <Aside></Aside>
  </el-aside>
  <el-container>
    <el-header>
      <Header></Header>
    </el-header>
    <el-main>
      <RouterView/>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
  </el-container>
</template>

<script setup lang="ts">
import Footer from '../components/footer/Footer.vue';
import Header from '../components/header/Header.vue';
import Aside from '../components/aside/Aside.vue';
</script>


<style lang="less" scoped>
.el-container {
  width: 100vw;
  height: 100vh;
  //display: flex; /* 明确设置为flex布局 */
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  width: 100%;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  height: 100vh;
  flex: 0 0 200px; /* 固定宽度200px */
  margin-right: 0; /* 确保右侧无间距 */
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  height: calc(100vh - 120px);
  flex: 1; /* 剩余空间全部给main */
  overflow: auto; /* 内容超出时显示滚动条 */
}
</style>