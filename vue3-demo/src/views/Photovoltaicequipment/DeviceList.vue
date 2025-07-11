<template>
  <div>
    <a-breadcrumb style="margin-bottom: 10px">
      <a-breadcrumb-item>
        <icon-menu-unfold />
      </a-breadcrumb-item>
      <a-breadcrumb-item>光伏设备</a-breadcrumb-item>
      <a-breadcrumb-item>设备列表</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <a-tabs v-model:active-key="tabsActiveKey">
        <a-tab-pane v-for="(item, index) in tabsList" :key="item.value" :title="item.key"> </a-tab-pane>
      </a-tabs>
      <!-- 表格内容  -->
      <a-table :loading="loading" ref="tableRef" row-key="id" v-bind:hide-expand-button-on-empty="true" :pagination="false" :bordered="{ wrapper: true, cell: true }" :columns="columns" :data="renderData">
        <!-- 设备名称 -->
        <template #deviceName="{ record }">
          <a-tag style="color: rgb(var(--primary-6))" checkable>
            <template #icon>
              <icon-storage v-if="record.isGroup == 1" style="color: rgb(var(--primary-6))" />
              <icon-thunderbolt v-else style="color: rgb(var(--primary-6))" />
            </template>
            {{ record.deviceName }}
          </a-tag>
        </template>
        <!-- 组件容量 kWp -->
        <template #ratedVolume="{ record }">
          <div v-if="record.isGroup == 0">{{ record.ratedVolume }}kWp</div>
        </template>
        <!-- 发电功率 kW -->
        <template #electricPower="{ record }">
          <div v-if="record.isGroup == 0">{{ record.deviceDayRuntime.electricPower }}kW</div>
        </template>
        <!-- 当日发电量 kWh -->
        <template #electricQuantity="{ record }">
          <div v-if="record.isGroup == 0">{{ record.deviceDayRuntime.electricQuantity }}kWh</div>
        </template>
        <!-- 当日满发电小时 -->
        <template #electricHours="{ record }">
          <div v-if="record.isGroup == 0">
            {{ record.deviceDayRuntime.electricHours || '0' }}
          </div>
        </template>
        <!-- 直流离散率 -->
        <template #dcDispersionRate="{ record }">
          <div v-if="record.isGroup == 0">{{ record.deviceDayRuntime.dcDispersionRate || '0' }}%</div>
        </template>
        <!-- 功率归一化 -->
        <template #normalizedRate="{ record }">
          <div v-if="record.isGroup == 0">{{ record.deviceDayRuntime.normalizedRate || '0' }}%</div>
        </template>
        <!-- 数据更新时间 -->
        <template #staticTime="{ record }">
          <div v-if="record.isGroup == 0">
            {{ record.deviceDayRuntime.staticTime || '-' }}
          </div>
        </template>
        <!-- 状态 -->
        <template #stopFlag="{ record }">
          <div v-if="record.isGroup == 0">
            <stopFlag :value="record.stopFlag"></stopFlag>
          </div>
        </template>
        <!-- 操作 -->
        <template #operate="{ record }">
          <a-button v-if="record.isGroup == 0" size="small" type="text" :status="record.stopFlag == 1 ? 'normal' : 'warning'" @click="handleStopFlag(record)">
            {{ record.stopFlag == 0 ? '停用' : '启用' }}
          </a-button>
          <a-button v-if="record.isGroup == 0" size="small" type="text" status="danger" @click="handleDelete(record)"> 删除 </a-button>
          <a-button v-if="record.isGroup == 0" size="small" type="text"  @click="handleToVariable">变量</a-button>
        </template>
      </a-table>
      <!-- 操作弹框  -->
      <a-modal width="450px" v-model:visible="operateModalModel.visible" class="modal-box">
        <template #title>
          <icon-close-circle v-if="operateModalModel.type == 1" size="18" style="color: rgb(var(--red-6)); margin-right: 5px" />
          <icon-exclamation-circle v-else size="18" style="color: rgb(var(--orange-6)); margin-right: 5px" />
          {{ '确认提示' }}
        </template>
        <div style="text-align: center">是否确认{{ operateModalModel.title }}名称为【{{ operateModalModel.name }}】的数据项？</div>
        <template #footer>
          <div style="text-align: center">
            <a-space>
              <a-button type="primary" status="danger" @click="handleOperateModelCancle">{{ '取消' }}</a-button>
              <a-button type="primary" @click="handleOperateModelOk">{{ '确认' }}</a-button>
            </a-space>
          </div>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { listDevice, listFusionGroup } from '../../api/device'
import { TableColumnData, TableInstance } from '@arco-design/web-vue'
import useLoading from '../../utils/loading'
const { loading, setLoading } = useLoading(true)
// import stopFlag from '../../components/stop-flag/index.vue'
import { useRouter } from 'vue-router'
//路由
const router = useRouter()
//选中的tab
const tabsActiveKey = ref<any>(0)
// //tab集合
const tabsList = ref<any>([])


/**
 * 获取tab
 */
const fetchTabData = async () => {
  const res = await listDevice()
  if (res.data.code == 200) {
    tabsList.value = res.data.data
    //默认选中第一个标签
    tabsActiveKey.value = res.data.data[0].value
    //默认查询第一个标签的内容
    await handleTabsChange()
  }
}
/**
 * 首次加载
 */
onMounted(async () => {
  await fetchTabData()
})


//设置表格列
const columns = computed<TableColumnData[]>(() => [
  {
    title: '名称',
    dataIndex: 'deviceName',
    slotName: 'deviceName',
    align: 'left',
    fixed: 'left',
    width: 180
  },


  {
    title: '组件容量(kWp)',
    dataIndex: 'ratedVolume',
    slotName: 'ratedVolume',
    align: 'center',
    width: 140
  },
  {
    title: '发电功率(kW)',
    dataIndex: 'deviceDayRuntime.electricPower',
    slotName: 'electricPower',
    align: 'center',
    width: 140
  },
  {
    title: '当日发电量(kWH)',
    dataIndex: 'deviceDayRuntime.electricQuantity',
    slotName: 'electricQuantity',
    align: 'center',
    width: 150
  },
  {
    title: '当日满发电小时',
    dataIndex: 'deviceDayRuntime.electricHours',
    slotName: 'electricHours',
    align: 'center',
    width: 140
  },
  {
    title: '直流离散率',
    dataIndex: 'deviceDayRuntime.dcDispersionRate',
    slotName: 'dcDispersionRate',
    align: 'center',
    width: 110
  },
  {
    title: '功率归一化',
    dataIndex: 'deviceDayRuntime.normalizedRate',
    slotName: 'normalizedRate',
    align: 'center',
    width: 120
  },
  {
    title: '数据更新时间',
    dataIndex: 'deviceDayRuntime.staticTime',
    slotName: 'staticTime',
    align: 'center',
    width: 140
  },
  {
    title: '状态',
    dataIndex: 'stopFlag',
    slotName: 'stopFlag',
    align: 'center',
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'operations',
    width: 220,
    slotName: 'operate',
    align: 'center',
    fixed: 'right'
  }
])
//表格数据
const renderData = ref<any[]>([])
//生成查询条件对象
const generateSearchModel = () => {
  return {
    groupName: ''
  }
}
//查询表单对象
const searchModel = ref(generateSearchModel())
//表格实例
const tableRef = ref<TableInstance>()
/**
 * table切换
 */
const handleTabsChange = async () => {
  searchModel.value.groupName = tabsList.value.find((item: any) => item.value == tabsActiveKey.value).key
  await fetchData()
  // 展开所有
  tableRef.value?.expandAll(true)
}
/**
 * 查询表格数据
 */
const fetchData = async () => {
  setLoading(true)
  try {
    const res = await listFusionGroup({
      ...searchModel.value
    })
    if (res.data.code == 200) {
      renderData.value = res.data.data
      //展开所有
      tableRef.value?.expandAll(true)
    }
  } catch (err) {
    console.error('fetchData', err)
  } finally {
    setLoading(false)
  }
}


//操作弹框
const generateOperateModalModel = () => {
  return {
    //0 状态 1删除
    type: 0,
    visible: false,
    title: '',
    id: 0,
    value: 0,
    name: ''
  }
}
//操作弹框模型
const operateModalModel = ref(generateOperateModalModel())
/**
 * 停用
 * @param record
 */
const handleStopFlag = (record: any) => {
  operateModalModel.value.visible = true
  operateModalModel.value.id = record.id
  operateModalModel.value.title = record.stopFlag == 0 ? '停用' : '启用'
  operateModalModel.value.name = record.deviceName
  operateModalModel.value.value = record.stopFlag == 0 ? 1 : 0
  operateModalModel.value.type = 0
}
/**
 * 删除数据
 * @param record 数据行
 */
const handleDelete = (record: any) => {
  operateModalModel.value.visible = true
  operateModalModel.value.id = record.id
  operateModalModel.value.title = '删除'
  operateModalModel.value.name = record.deviceName
  operateModalModel.value.type = 1
}
/**
 * 提示弹框取消
 */
const handleOperateModelCancle = () => {
  operateModalModel.value = generateOperateModalModel()
}
/**
 * 提示弹框确认
 */
const handleOperateModelOk = () => {
  //停用
  if (operateModalModel.value.type == 0) {
    for (let i = 0; i < renderData.value.length; i++) {
      for (let j = 0; j < renderData.value[i].children.length; j++) {
        if (renderData.value[i].children[j].id === operateModalModel.value.id) {
          renderData.value[i].children[j].stopFlag = operateModalModel.value.value
          break
        }
      }
    }
  }
    //删除
  if (operateModalModel.value.type == 1) {
    for (let i = 0; i < renderData.value.length; i++) {
      for (let j = 0; j < renderData.value[i].children.length; j++) {
        if (renderData.value[i].children[j].id === operateModalModel.value.id) {
          renderData.value[i].children.splice(j, 1)
          break
        }
      }
    }
  }
  //弹窗关闭
  operateModalModel.value.visible = false
}
/**
 * 跳转到变量列表页面
 */
const handleToVariable = () => {
  router.push({
    path: '/Photovoltaicequipment/variablelist'
  })
}
</script>