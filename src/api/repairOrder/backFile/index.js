import { post } from "@/utils/request";
const commonUrl = "biz";

// 实时监控数据
export function getInfo(data) {
  return post("/RepairOrderFile/Get", data, commonUrl);
}
export function add(data) {
  return post("/RepairOrderFile/Create", data, commonUrl);
}
export function update(data) {
  return post("/RepairOrderFile/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/RepairOrderFile/Remove", data, commonUrl);
}
export function senderOrder(data) {
  return post("/RepairOrderFile/Send", data, commonUrl);
}
