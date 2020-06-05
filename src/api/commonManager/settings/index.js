import { post } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList (data) {
  return post("/Setting/Gets", data, commonUrl);
}
// 获取用户权限
export function getInfo (data) {
  return post("/Setting/Get", data, commonUrl);
}
// 编辑角色
export function update (data) {
  return post("/Setting/Modify", data, commonUrl);
}
// 新增角色
export function add (data) {
  return post("/Setting/Create", data, commonUrl);
}
// 获取用户权限
export function deleted (data) {
  return post("/Setting/Remove", data, commonUrl);
}
