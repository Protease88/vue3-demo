<template>
  <div>
    <a-card class="chart-container" :title="chartInfo.cardName" style="margin-top: 10px">
      <template #extra>
        <timebar @change="timeBarChange" isCurrentDateDisabled />
      </template>
      <a-spin :loading="loading" class="chart-view">
        <CustomChart :options="chartInfo.echartsOption" style="height: 300px" />
      </a-spin>
    </a-card>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue'
import timebar from '../components/timebar/index.vue'
import { getTimeObject, handleConfigChart } from '../utils/charts.ts'
import { getChartInfo } from '../api/home-pv.ts'
import CustomChart from '../components/custom-chart/index.vue'



// 定义图表信息的接口
interface IChartInfo {
  cardName: string
  echartsOption: any
  singleInfo: null | any
}
// 图表信息
const chartInfo = ref<IChartInfo>({
  cardName: '',
  echartsOption: {},
  singleInfo: null
})
// 时间选择器参数
const timeOptions = ref<any>({})
// 时间变化处理函数
const timeBarChange = async (timer: any) => {
  timeOptions.value = timer
  await fetchData()
}

// 数据获取函数
const fetchData = async () => {
    const params = {
      configId: '280',
      cardKey: '1719898783775',
     ...getTimeObject(timeOptions.value)
    }

    const res: any = await getChartInfo(params)
    
      chartInfo.value = {
        ...res.data.data,
        echartsOption: handleConfigChart(res.data.data.echartsOption)

    }
  
}
</script>

<style scoped lang="less">
.chart-container {
  height: 100%;
  width: 100%;

  :deep(.arco-card-body) {
    width: 100%;
    height: calc(100% - 46px);
  }

  .chart-view {
    width: 100%;
    height: 100%;
  }
  .arco-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>