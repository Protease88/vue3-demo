//封装axios，进行调用后端接口API
import axios from 'axios'; //引用axios

// 创建 Axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8888/dev-api', // API 基础 URL
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});
export default request;