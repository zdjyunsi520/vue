import { get, post, put, deleted } from "@/utils/post";
const path = "/system/withdraw/buyer/";
export function fetchList(data) {
  return get(path + "list", data);
}
export function exportExcel(data) {
  return get(path + "excel", data);
}
export function review(data) {
  return put(path + "audit-one", data);
}
export function review1(data) {
  return put(path + "audit-two", data);
}
//导出泉州银行模板
export function exportQZExcel(data) {
  return get(path + "excel/quanzhou_bank", data);
}
//导出农信银行模板
export function exportNXExcel(data) {
  return get(path + "excel/ruralCredit", data);
}
//导出光大银行模板
export function exportGDExcel(data) {
  return get(path + "excel/everbrightBank", data);
}

//导出厦门国际银行模板
export function exportXMExcel(data) {
  return get(path + "excel/xiamenInternationalBank", data);
}
