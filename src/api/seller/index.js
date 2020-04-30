import { get, post, put, deleted, putForm, postForm } from "@/utils/post";
const path = "/system/mer/info/";
export function fetchList(data) {
  return get(path + "list", data);
}
export function getInfoById(data) {
  return get(path + "find", data);
}

export function exportExcel(data) {
  return get(path + "excel", data);
}

//修改
export function update(data) {
  return putForm(path + "update", data);
}
export function disabled(data) {
  return put(path + "disable", data);
}

const path1 = "/system/mer/oneById/";
//id进入商家详情
export function fetchInfo(data) {
  return get(path1 + "info", data);
}
//id进入商家资金日志记录
export function fetchCapital(data) {
  return get(path1 + "capitalFlow", data);
}
//查看商家已撤销订单
export function fetchRevoke(data) {
  return get(path1 + "merchant/orders_cancelled", data);
}
//查看商家进行中订单
export function fetchPending(data) {
  return get(path1 + "merchant/orders_doing", data);
}
//查看商家已完成订单
export function fetchFinished(data) {
  return get(path1 + "merchant/orders_finished", data);
}
//查看商家待接订单
export function fetchWaiting(data) {
  return get(path1 + "merchant/orders_pending", data);
}
//id进入商家充值记录
export function fetchRecharge(data) {
  return get("/system/mer/oneById/recharge", data);
}
//id进入商家店铺详情
export function fetchStore(data) {
  return get("/system/mer/oneById/store", data);
}
export function special(data) {
  return post("/m/setSpecial", data);
}
//发送商家站内信
export function sendSellerLetter(data) {
  return postForm("/system/mer/msg", data);
}
//修改推管员信息
export function updateExtension(data) {
  return putForm("/system/mer/info/promoter", data);
}
