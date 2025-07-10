<template>

      <h5 class="mb-2">光伏能源管理系统</h5>
      <el-menu
        :default-active="route.fullpath"
        class="el-menu-vertical-demo"
        :router="true"
      >
        <div v-for="data in menuList" :key="data.path">
          <el-sub-menu :index="data.path" v-if="data.children.length">
          <template #title>
            <el-icon>
              <component :is="mapIcons[data.icon]"></component>
            </el-icon>
            <span>{{ data.title }}</span>
          </template>
             <div v-for="item in data.children" :key="item.path">
                        <el-menu-item :index="item.path">
                            <el-icon><icon-menu /></el-icon>
                            <span>{{ item.title }}</span>
                        </el-menu-item>
             </div>
          </el-sub-menu>
           <el-menu-item :index="data.path" v-else>
            <el-icon>
              <component :is="mapIcons[data.icon]"></component>
            </el-icon>
            <span>{{ data.title }}</span>
          </el-menu-item>
        </div>
      </el-menu>

</template>

<script setup lang="ts">
import {ref,onMounted} from 'vue'
import {getMenu} from '../../api/user'
import { Aim, DataLine, Film, Sunny, Warning, Operation, FullScreen } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const menuList = ref([])

const route=useRoute()

const fechMenu=async()=>{
  const resp=await getMenu()
  menuList.value=resp.data.data
  // console.log(resp)
}
onMounted(()=>{
  fechMenu()
})

// 图标映射
const mapIcons = {
    Aim,
    DataLine,
    Film,
    Sunny,
    Warning,
    Operation,
    FullScreen
}
</script>
