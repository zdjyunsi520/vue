import { get } from "@/utils/post";
export function fetchList(data) {
  return get("/system/platform/fund_pool/recharge", data);
}
export function exportExcel(data) {
  return get("/system/platform/fund_pool/recharge/export", data);
}
