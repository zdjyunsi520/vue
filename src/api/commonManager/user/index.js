import { post, post2 } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList(data) {
  return post("/User/Gets", data, commonUrl);
}
// 添加用户
export function add(data) {
  return post("/User/Create", data, commonUrl);
}
// 编辑用户
export function update(data) {
  return post("/User/Modify", data, commonUrl);
}
// 编辑用户
export function password(data) {
  return post("/User/ModifyForPassword", data, commonUrl);
}
//获取权限
export function getRole(data) {
  return post("/User/GetPower", data, commonUrl);
}
//设置权限
export function updateRole(data) {
  return post2("/User/SetPower", data, commonUrl);
}
export function locklock(data) {
  return post("/User/SetLock", data, commonUrl);
}
