import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班查询
export function fetchList (data) {
  return post("/DutyHandover/Gets", data, commonUrl);
}