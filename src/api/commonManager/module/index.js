import { post } from "@/utils/request";
const commonUrl = "common";
// 获取模块列表
export function fetchList(data) {
  return post("/Module/GetHierarchicalDtos", data, commonUrl);
}
// 获取模块详情
export function getInfo(data) {
  return post("/Module/Get", data, commonUrl);
}
// 新增模块信息
export function add(data) {
  return post("/Module/Create", data, commonUrl);
}
// 修改模块信息
export function update(data) {
  return post("/Module/Modify", data, commonUrl);
}
// 修改模块信息
export function deleted(data) {
  return post("/Module/Remove", data, commonUrl);
}
