import axios from "axios";
import qs from "qs";
import request from "vue3-demo/src/utils/request";
/**
 *获取表格数据
 */
export function listGroupAll(params: any) {
  return axiosInstance.get("/system/group/listAll", {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    }
  });
}