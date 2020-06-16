import { post, post2 } from "@/utils/request";
const commonUrl = "tool";
// 获取模块列表
export function fetchList(data) {
  return post("/Agreement/Get", data, commonUrl);
}
// 编辑模块信息
export function update(data) {
  return post2("/Agreement/Modify", data, commonUrl);
}
