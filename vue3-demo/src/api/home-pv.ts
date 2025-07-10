import request from "../utils/request";
import qs from "qs";

/**
 * 图表传输参数
 */
interface ChartInfo {
  configId: number, //配置ID
  cardKey: number | string, //卡片key
  deviceSn?: string, //设备编号
  dayTime?: string, //天日期
  monthTime?: string, //月日期
  yearTime?: string //年日期
}

export function getChartInfo(params: ChartInfo) {
  return request.get('/datav/common/chart/getChart', {
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params);
    }
  });
}