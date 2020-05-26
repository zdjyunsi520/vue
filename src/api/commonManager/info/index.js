import { post } from "@/utils/request";
const commonUrl = "tool";
// 获取模块列表
export function fetchList(data) {
  return post("/Agreement/Get", data, commonUrl);
}
// 修改模块信息
export function update(data) {
  return post("/Agreement/Modify", data, commonUrl);
}
