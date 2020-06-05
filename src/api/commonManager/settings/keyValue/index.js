import { post } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList (data) {
  return post("/SettingItem/Gets", data, commonUrl);
}
// 获取用户权限
export function getInfo (data) {
  return post("/SettingItem/Get", data, commonUrl);
}
// 编辑角色
export function update (data) {
  return post("/SettingItem/Modify", data, commonUrl);
}
// 新增角色
export function add (data) {
  return post("/SettingItem/Create", data, commonUrl);
}
// 获取用户权限
export function deleted (data) {
  return post("/SettingItem/Remove", data, commonUrl);
}
