import { post } from "@/utils/request";
const commonUrl = "Tool";
// 获取模块列表
export function fetchList(data) {
  return post("/Assets/Gets", data, commonUrl);
}
// 删除
export function deleted(data) {
  return post("/Assets/Remove", data, commonUrl);
}
// 新增模块信息
export function add(data) {
  return post("/Assets/Create", data, commonUrl);
}
// 同步摄像头
export function syncCamera(data) {
  return post("/Monitor/SyncToCloud", data, "dev");
}
// 同步烟感
export function syncSmoke(data) {
  return post("/Smoke/SyncToCloud", data, "dev");
}
// 修改模块信息
export function update(data) {
  return post("/Assets/Modify", data, commonUrl);
}
