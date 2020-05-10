import { post } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList(data) {
  return post("/Industry/GetTree", data, commonUrl);
}
// 获取用户权限
export function getInfo(data) {
  return post("/Industry/Get", data, commonUrl);
}
// 修改角色
export function update(data) {
  return post("/Industry/Modify", data, commonUrl);
}
// 新增角色
export function add(data) {
  return post("/Industry/Create", data, commonUrl);
}
// 新增角色
export function deleted(data) {
  return post("/Industry/Remove", data, commonUrl);
}
