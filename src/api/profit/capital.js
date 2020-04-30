import { get } from "@/utils/post";
const path = "/system/platform/fund/collection";
export function fetchList(data) {
  return get(path, data);
}

//导出利润明细
export function exportExcel(data) {
  return get(path + "/export", data);
}
