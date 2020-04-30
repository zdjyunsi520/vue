import { get, post, put, deleted } from "@/utils/post";
const path = "/system/withdraw/merchant/";
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
