import { post } from "@/utils/request";
const commonUrl = "Org";
// 获取列表
export function fetchList(data) {
  return post("/Tenant/Gets", data, commonUrl);
}
// 获取树
export function fetchTree(data) {
  return post("/Tenant/GetHierarchicalDtos", data, commonUrl);
}
// 删除
export function deleted(data) {
  return post("/Assets/Remove", data, commonUrl);
}
// 新增模块信息
export function add(data) {
  return post("/Tenant/Create", data, commonUrl);
}
// 获取权限
export function getRole(data) {
  return post("/unitRoleModule/GetPower", data, commonUrl);
}
// 设置权限
export function setRole(data) {
  return post("/unitRoleModule/SetPower", data, commonUrl);
}
// 修改模块信息
export function update(data) {
  return post("/Tenant/Modify", data, commonUrl);
}

//禁用/启用
export function disabled(data) {
  return post("/Tenant/SetEnable", data, commonUrl);
}
