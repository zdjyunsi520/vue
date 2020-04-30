import { get } from "@/utils/post";
export function fetchList(data) {
  return get("/system/buyer/fund/list", data);
}
export function exportExcel(data) {
  return get("/system/buyer/fund/export", data);
}
