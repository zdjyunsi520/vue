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
// 同步
export function syncEquipment(data) {
  return post("/Assets/SyncToCloud", data, "tool");
}
// 取消同步
export function cancelEquipment(data) {
  return post("/Assets/CancelSyncToCloud", data, "tool");
}
// 修改模块信息
export function update(data) {
  return post("/Assets/Modify", data, commonUrl);
}
