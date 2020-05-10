import { post } from "@/utils/request";
const commonUrl = "Org";
// 获取模块列表
export function fetchList(data) {
  return post("/Employee/Gets", data, commonUrl);
}

// 新增模块信息
export function add(data) {
  return post("/Employee/Create", data, commonUrl);
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
  return post("/Employee/Modify", data, commonUrl);
}
// 修改密码
export function password(data) {
  return post("/User/ModifyForPassword", data, "Common");
}
// 开通账号
export function createAccount(data) {
  return post("/Employee/OpenAccount", data, commonUrl);
}
