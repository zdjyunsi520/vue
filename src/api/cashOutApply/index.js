import { get, post, put, deleted, putForm } from "@/utils/post";
const path = "/system/withdraw/centre/";
export function fetchList(data) {
  return get(path + "deptWithdrawList", data);
}
export function amount(data) {
  return get(path + "amount", data);
}
export function add(data) {
  return post(path + "withdrawAppayFor", data);
}
//获取分站提现验证码
export function getCode() {
  return putForm(path + "updatePasswordCode");
}
//修改分站提现密码
export function updatePwd(data) {
  return putForm(path + "updatePassword", data);
}
