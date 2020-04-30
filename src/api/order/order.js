import { get, post, putForm, deleted, postForm, put } from "@/utils/post";
const path = "/system/order/";
export function fetchList(data) {
  return get("/system/orders", data);
}
export function buyerRefund(data) {
  return putForm(path + "buyer_refund", data);
}
export function sellerRefund(data) {
  return putForm(path + "merchant_refund", data);
}
export function revoke(data) {
  return putForm("/system/orders/cancel", data);
}
export function details(data) {
  return get(path + data);
}
export function revokeBuyer(data) {
  return putForm("/system/order/buyer_revert", data);
}
export function escape(data) {
  return post("/system/escape_single/add", data);
}
//异常订单批量强制完成订单
export function complete(data) {
  return putForm("/system/orders/finish", data);
}

export function exportExcel(data) {
  return get("/system/orders/export", data);
}

//撤销订单佣金
export function revokeMoney(data) {
  return putForm("/system/order/cancel/without_commission", data);
}

//撤销追评任务
export function revokeAddEvaluation(data) {
  return put("/system/order/appended/cancel", data);
}
