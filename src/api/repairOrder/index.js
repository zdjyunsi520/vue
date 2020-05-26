import { post } from "@/utils/request";
const commonUrl = "biz";

// 实时监控数据
export function fetchList(data) {
  return post("/RepairOrderReceive/Gets", data, commonUrl);
}
export function add(data) {
  return post("/RepairOrderReceive/Create", data, commonUrl);
}
export function update(data) {
  return post("/RepairOrderReceive/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/RepairOrderReceive/Remove", data, commonUrl);
}
