// 引入request对象
import request from "../utils/request";

// 定义登录用户对象
interface loginDate {
  username: string,
  password: string
}

// 用户登录接口
export function login(data: loginDate) {
  return request.post('/auth/login', data)
}