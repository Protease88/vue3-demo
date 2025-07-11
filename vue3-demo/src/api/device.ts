import axios from "axios";
import qs from "qs";
import request from "../utils/request";
/**
 *获取表格数据
 */
export function listGroupAll(params: any) {
  return request.get("/system/group/listAll", {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}

/**
 * 获取标签页数据
 */
export function listDevice() {
  return request.get("/system/device/getPVTab");
}
/**
 * 设备列表
 * @param params 查询参数
 * @returns 结果
 */
export function listFusionGroup(params: any) {
  return request.get("/system/device/listFusionGroup", {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}