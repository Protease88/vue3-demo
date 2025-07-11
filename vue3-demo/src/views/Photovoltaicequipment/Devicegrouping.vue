<template>
  <div>
    <a-breadcrumb style="margin-bottom: 10px">
      <a-breadcrumb-item>
        <icon-menu-unfold />
      </a-breadcrumb-item>
      <a-breadcrumb-item>光伏设备</a-breadcrumb-item>
      <a-breadcrumb-item>设备分组</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <!-- 查询条件 start-->
      <a-row>
        <a-col :flex="1" style="margin-top: 4px">
          <a-form :model="searchModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" label-align="left" auto-label-width>
            <a-row :gutter="8">
              <a-col :span="8">
                <a-form-item label="分类状态">
                  <a-select v-model="searchModel.stopFlag" placeholder="请选择" allow-clear>
                    <a-option value="0">正常</a-option>
                    <a-option value="1">停用</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-divider style="height: 35px" direction="vertical" />
              <a-col :span="8">
                <a-col :flex="'86px'">
                  <a-space :size="18">
                    <a-button type="primary" @click="search">
                      <template #icon>
                        <icon-search />
                      </template>
                      {{ '查询' }}
                    </a-button>
                  </a-space>
                </a-col>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <!-- 查询条件 end-->
      <!-- 分割线 -->
      <a-divider style="margin-top: 0" />
      <!-- 表格内容 -->
      <a-table :loading="loading" row-key="id" :pagination="false" :bordered="{ wrapper: true, cell: true }" :columns="columns" :data="renderData">
        <template #stopFlag="{ record }">
          <stopFlag :value="record.stopFlag"></stopFlag>
        </template>
        <template #operate="{ record }">
          <a-button size="small" type="text" :status="record.stopFlag == 1 ? 'normal' : 'warning'" @click="handleStopFlag(record)">
            {{ record.stopFlag == 0 ? '停用' : '启用' }}
          </a-button>
        </template>
      </a-table>
      <!-- 操作弹框 start -->
      <a-modal width="450px" v-model:visible="operateModalModel.visible" class="modal-box">
        <template #title>
          <icon-exclamation-circle  size="18" style="color: rgb(var(--orange-6)); margin-right: 5px" />
          确认提示
        </template>
        <div style="text-align: center">是否确认{{ operateModalModel.title }}名称为【{{ operateModalModel.name }}】的数据项？</div>
        <template #footer>
          <div style="text-align: center">
            <a-space>
              <a-button type="primary" status="danger" @click="handleOperateModelCancle">取消</a-button>
              <a-button type="primary" @click="handleOperateModelOk">确认</a-button>
            </a-space>
          </div>
        </template>
      </a-modal>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useLoading from '../../utils/loading'
// import stopFlag from '../../components/stop-flag/index.vue'
import { listGroupAll } from '../../api/device'
const { loading, setLoading } = useLoading(true)
//生成查询条件对象
const generateSearchModel = () => {
  return {
    //状态
    stopFlag: '',
    //固定值 3
    mapId: 3
  }
}
//查询表单对象
const searchModel = ref(generateSearchModel())
//设置表格列
const columns = computed<any[]>(() => [
  {
    title: '编号',
    dataIndex: 'id',
    align: 'center',
    width: 100
  },
  {
    title: '分组名称',
    dataIndex: 'groupName'
  },
  {
    title: '备注',
    dataIndex: 'remark'
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
    width: 210,
    slotName: 'operate',
    align: 'center'
  }
])
//表格数据
const renderData = ref<any[]>([])
/**
 * 查询表格数据
 */
const fetchData = async () => {
  setLoading(true)
  //清空表格数据
  renderData.value = []
  try {
    const res = await listGroupAll({
      ...searchModel.value
    })
    removeEmptyChildren(res.data.data)
    renderData.value = res.data.data
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
/**
 * 删除空数据
 * @param data
 */
const removeEmptyChildren = (data: any) => {
  data.forEach((item: any, index: number) => {
    if (item.children && item.children.length === 0) {
      delete data[index].children
    } else if (item.children) {
      removeEmptyChildren(item.children)
    }
  })
}
onMounted(async () => {
  // 初始化表格数据
  await fetchData()
})


//查询
const search = async () => {
  await fetchData()
}
//操作弹框
const generateOperateModalModel = () => {
  return {
    visible: false,
    title: '',
    id: 0,
    value: 0,
    name: '',
    type: 0 // 添加缺失的type属性
  }
}
//操作弹框模型
const operateModalModel = ref(generateOperateModalModel())
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
  for (let i = 0; i < renderData.value.length; i++) {
    if (renderData.value[i].id === operateModalModel.value.id) {
      renderData.value[i].stopFlag = operateModalModel.value.value
    }
  }
  //关闭弹框
  operateModalModel.value.visible = false
}
//停用
const handleStopFlag = (record: any) => {
  operateModalModel.value.visible = true
  operateModalModel.value.id = record.id
  operateModalModel.value.title = record.stopFlag == 0 ? '停用' : '启用'
  operateModalModel.value.name = record.groupName
  operateModalModel.value.value = record.stopFlag == 0 ? 1 : 0
  operateModalModel.value.type = 0
}
</script>