import { post } from "@/utils/request";
const commonUrl = "common";
// 获取用户列表
export function fetchList(data) {
  return post("/Role/Gets", data, commonUrl);
}
// 添加用户
export function getInfo(data) {
  return post("/Role/Get", data, commonUrl);
}
// 修改用户
export function update(data) {
  return post("/Role/Modify", data, commonUrl);
}
// 修改用户
export function password(data) {
  return post("/User/ModifyForPassword", data, commonUrl);
}
