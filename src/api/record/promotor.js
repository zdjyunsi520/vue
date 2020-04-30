import { get } from "@/utils/post";
export function fetchList(data) {
  return get("/system/management/Extension/income/list", data);
}
export function exportExcel(data) {
  return get("/system/management/Extension/income/export", data);
}
