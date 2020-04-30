import { get } from "@/utils/post";
export function fetchList(data) {
  return get("/system/commission/rate/record/list", data);
}
