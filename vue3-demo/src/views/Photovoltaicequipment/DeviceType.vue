<template>
  <div>
    <a-breadcrumb style="margin-bottom: 10px">
      <a-breadcrumb-item>
        <icon-menu-unfold />
      </a-breadcrumb-item>
      <a-breadcrumb-item>光伏设备</a-breadcrumb-item>
      <a-breadcrumb-item>设备类型</a-breadcrumb-item>
    </a-breadcrumb>
    <a-card>
      <!-- 查询条件 start-->
      <a-row>
        <a-col :flex="1" style="margin-top: 4px">
          <a-form :model="searchModel" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }" l abel-align="left" auto-label-width>
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
      <!-- 新建按钮 -->
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              {{ '新建' }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <!-- 表格内容 -->
      <a-table :loading="loading" row-key="id" :pagination="false" :bordered="{ wrapper: true, cell: true }" :columns="columns" :data="renderData">
        <template #stopFlag="{ record }">
          <stopFlag :value="record.stopFlag"></stopFlag>
        </template>
        <template #operate="{ record }">
          <a-button size="small" type="text" :status="record.stopFlag == 1 ? 'normal' : 'warning'" @click="handleStopFlag(record)">
            {{ record.stopFlag == 0 ? '停用' : '启用' }}
          </a-button>
          <a-button size="small" type="text" status="success">
            {{ '编辑' }}
          </a-button>
          <a-button size="small" type="text" status="danger">
            {{ '删除' }}
          </a-button>
        </template>
      </a-table>
      <!-- 添加右弹层 start -->
      <a-drawer :width="750" :visible="formDrawer.visible" @cancel="handleFormCancel" @ok="handleSubmitForm" :mask-closable="false">
        <template #title>
          {{ formDrawer.formModel.tag === 1 ? '添加分组' : '编辑分组' }}
        </template>
        <a-spin style="width: 100%; height: 100%" :loading="formDrawer.loading">
          <a-row :gutter="24" class="row-mp-30">
            <a-col :span="24">
              <a-form ref="formRef" auto-label-width :model="formDrawer.formModel" label-align="right" :rules="formDrawer.rules">
                <a-form-item field="groupName" label="分组名称">
                  <a-input placeholder="请输入汉字、字母、或数字，最多20字符" v-model="formDrawer.formModel.groupName" />
                </a-form-item>
                <a-form-item field="parentId" label="上级目录">
                  <a-tree-select
                    allow-search
                    v-model="formDrawer.formModel.parentId"
                    :fieldNames="{
                      key: 'id',
                      title: 'groupName',
                      children: 'children'
                    }"
                    :data="parentList"
                    placeholder="根目录"
                  ></a-tree-select>
                </a-form-item>
                <!-- 显示顺序  -->
                <a-form-item field="orderNum" label="显示顺序">
                  <a-input-number v-model="formDrawer.formModel.orderNum" />
                </a-form-item>
                <!-- 启用状态 -->
                <a-form-item field="stopFlag" label="启用状态">
                  <a-switch :checked-value="checkedValue" :unchecked-value="unCheckedValue" v-model="formDrawer.formModel.stopFlag">
                    <template #checked>{{ '启用' }}</template>
                    <template #unchecked>{{ '停用' }} </template>
                  </a-switch>
                </a-form-item>
                <a-form-item field="remark" label="备注">
                  <a-textarea placeholder="请输入备注，最多不超过200字" :max-length="200" v-model="formDrawer.formModel.remark" allow-clear />
                </a-form-item>
              </a-form>
            </a-col>
          </a-row>
        </a-spin>
      </a-drawer>
      <!-- 操作弹框 start -->
      <a-modal width="450px" v-model:visible="operateModalModel.visible" class="modal-box">
        <template #title>
          <icon-close-circle v-if="operateModalModel.type == 1" size="18" style="color: rgb(var(--red-6)); margin-right: 5px" />
          <icon-exclamation-circle v-else size="18" style="color: rgb(var(--orange-6)); margin-right: 5px" />
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
const { loading, setLoading } = useLoading(true)
// import stopFlag from '../components/stop-flag/index.vue'
import { listGroupAll } from '../../api/device'
import { FormInstance } from 'element-plus'
// import { FormInstance } from '@arco-design/web-vue/es/form'
//生成查询条件对象
const generateSearchModel = () => {
  return {
    //状态
    stopFlag: '',
    //设备类型,固定值
    mapId: 4
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
    width: 250,
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
  renderData.value = []
  try {
    const res = await listGroupAll({
      ...searchModel.value
    })
    removeEmptyChildren(res.data.data)
    renderData.value = res.data.data
  } catch (err) {
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
  await fetchData()
})


//查询
const search = async () => {
  await fetchData()
}


//生成表单模型
const generateFormDrawerModel = () => {
  return {
    visible: false,
    loading: false,
    rules: {
      groupName: [{ required: true, message: '请输入分组名称' }],
      parentId: [{ required: true, message: '请选择上级目录' }],
      orderNum: [{ required: true, message: '请输入顺序' }]
    },
    formModel: {
      id: 3,
      groupName: '',
      parentId: 0,
      orderNum: 0,
      stopFlag: 0,
      mapId: 4,
      remark: '',
      tag: 0
    }
  }
}
//表单模型
const formDrawer = ref(generateFormDrawerModel())
//默认上级目录
const parentList = ref<any>([
  {
    id: 0,
    groupName: '根目录'
  }
])
// 表单实例
const formRef = ref<FormInstance>()
//switch选中值
const checkedValue = ref<number>(0)
//switch未选中值
const unCheckedValue = ref<number>(1)
/**
 * 关闭弹层
 */
const handleFormCancel = () => {
  formDrawer.value = generateFormDrawerModel()
  formRef.value?.resetFields()
}
/**
 * 提交表单
 */
const handleSubmitForm = async () => {
  // 校验表单
  const validate = await formRef.value?.validate()
  if (validate) {
    return
  }
  //新建
  if (formDrawer.value.formModel.tag === 1) {
    //将formDrawer的数据添加到renderData中
    const value = formDrawer.value.formModel
    //将数据添加的本地，不发送请求
    renderData.value.push(value)
  }
  //关闭弹层
  formDrawer.value.visible = false
}
//新建
const handleAdd = async () => {
  // // 打开弹层
  formDrawer.value.visible = true
  formDrawer.value.formModel.tag = 1
  // //清空表单数据
  formRef.value?.resetFields()
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
    console.log(operateModalModel.value.id)
    console.log(operateModalModel.value.name)
    for (let i = 0; i < renderData.value.length; i++) {
      if (renderData.value[i].id === operateModalModel.value.id) {
        renderData.value[i].stopFlag = operateModalModel.value.value
      }
    }
  }
  //关闭弹框
  operateModalModel.value.visible = false
}
//停用、启用
const handleStopFlag = (record: any) => {
  operateModalModel.value.visible = true
  operateModalModel.value.id = record.id
  operateModalModel.value.title = record.stopFlag == 0 ? '停用' : '启用'
  operateModalModel.value.name = record.groupName
  operateModalModel.value.value = record.stopFlag == 0 ? 1 : 0
  operateModalModel.value.type = 0
}
</script>