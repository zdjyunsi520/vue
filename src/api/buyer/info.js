import { get, post, put, deleted, putForm, postForm } from "@/utils/post";
const path = "/system/buyer/info/";
export function fetchList(data) {
  return get(path + "list", data);
}
export function getInfoById(data) {
  return get(path + "find", data);
}
//禁止买手接单
export function orderForbid(data) {
  return putForm(path + "forbidden", data);
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
export function block(data) {
  return put(path + "black", data);
}
export function blockAll(data) {
  return put(path + "black_all", data);
}
//会员相关
export function add(data) {
  return post("/system/member/addMerchant/add", data);
}
export function addMutiple(data) {
  return post("/system/member/addMerchant/batchBuyer", data);
}
export function exportTemp(data) {
  return get("/system/member/addMerchant/export", data);
}
export function pass(data) {
  return put("/system/member/audit/by", data);
}
export function refuse(data) {
  return put("/system/member/audit/turnDown", data);
}
export function list(data) {
  return get("/system/member/audit/list", data);
}
//买手下级
export function lowList(data) {
  return get(path + "subordinate", data);
}

export function special(data) {
  return post(path + "isSpecial", data);
}
const path1 = "/system/buyer/oneById/";
//id进入刷手详情
export function buyerInfo(data) {
  return get(path1 + "info", data);
}
//id进入资金明细详情
export function buyerRecharge(data) {
  return get(path1 + "capitalFlow", data);
}
//查看买手订单列表
export function buyerOrder(data) {
  return get(path1 + "buyer/orders", data);
}
//管理端添加设置所有的邀请人可接高价单
export function setHigh(data) {
  return put("/system/buyer/info/high_price", data);
}
//管理端添加设置所有的邀请人可接高价单且立返
export function setHighRightNow(data) {
  return put("/system/buyer/info/high_price/immediately", data);
}

//查看买手订单列表
export function plugInCondition(data) {
  return get("/system/buyer/info/assister/case", data);
}

//查看买手订单列表
export function orderUpdate(data) {
  return get("/system/buyer/info/unusual/restore?buyerAcccount=" + data);
}
//发送买手站内信
export function sendSellerLetter(data) {
  return postForm("/system/buyer/info/sendMsgToBuyer", data);
}
//重置买手提现密码和登录密码相同
export function resetCashoutPwd(data) {
  return put("/system/buyer/info/update_withdraw_password", data);
}
