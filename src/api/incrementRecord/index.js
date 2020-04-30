import { get, postForm } from "@/utils/post";
const path = "/system/third-party/record/";
//购买快递记录
export function express(data) {
  return get(path + "express-delivery-record", data);
}
//打标签记录
export function marking(data) {
  return get(path + "tag", data);
}
//旺旺号记录
export function wangwang(data) {
  return get(path + "want-want", data);
}

//余量查询
export function leftCount(data) {
  return get("/system/mirror/user/surplus_number", data);
}

//快递单价以余额
export function expressCount(data) {
  return get("/system/dkb/express/price", data);
}
//韵达信封次数查询
export function YundaCount(data) {
  return get("/system/dkb/express/yd/price", data);
}
//查询平台第三方服务收入记录
export function incrementEarn(data) {
  return get("/system/platform/profit/third_records", data);
}
//导出第三方服务收入记录
export function exportIncrementEarn(data) {
  return get("/system/platform/profit/third_records/excel", data);
}
//极品包余额查询
export function jpCount(data) {
  return get("/system/dkb/express/jpb/price", data);
}
//极品包购买记录
export function jpList(data) {
  return get("/system/gift/express/list", data);
}
