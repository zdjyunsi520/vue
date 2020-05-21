import { post } from "@/utils/request";
const commonUrl = "tool";
// 获取地区列表
export function fetchList(data) {
  return post("/AppVersionInfo/Gets", data, commonUrl);
}
// 获取地区信息详情
export function getInfo(data) {
  return post("/AppVersionInfo/Get", data, commonUrl);
}
// 添加地区信息
export function add(data) {
  return post("/AppVersionInfo/Create", data, commonUrl);
}
// 修改地区信息
export function update(data) {
  return post("/AppVersionInfo/Modify", data, commonUrl);
}
// 删除地区信息
export function deleted(data) {
  return post("/AppVersionInfo/Remove", data, commonUrl);
}
export function updateStatus(data) {
  return post("/AppVersionInfo/SetStatus", data, commonUrl);
}
