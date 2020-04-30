import { get, postForm } from "@/utils/post";
export function getRid(data) {
  return postForm("/system/backstage/recharge/platform/profit/deduction", data);
}
export function fetchList(data) {
  return get("/system/platform/profit/deduction/records", data);
}
export function exportExcel(data) {
  return get("/system/platform/profit/deduction/export", data);
}
