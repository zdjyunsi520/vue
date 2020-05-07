import { post } from "@/utils/request";
const commonUrl = "common";
// 获取模块列表
export function fetchList(data) {
  return post("/Module/GetHierarchicalDtos", data, commonUrl);
}
// 获取模块列表详情
export function getInfo(data) {
  return post("/Module/Get", data, commonUrl);
}
