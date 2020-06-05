import { post } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList (data) {
  return post("/Role/Gets", data, commonUrl);
}
// 获取用户权限
export function getInfo (data) {
  return post("/Role/Get", data, commonUrl);
}
// 编辑角色
export function update (data) {
  return post("/Role/Modify", data, commonUrl);
}
// 新增角色
export function add (data) {
  return post("/Role/Create", data, commonUrl);
}
// 获取用户权限
export function getInfo1 (data) {
  return post("/Module/GetHierarchicalDtos", data, commonUrl);
}
