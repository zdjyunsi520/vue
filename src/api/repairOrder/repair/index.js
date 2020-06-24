import { post } from "@/utils/request";
const commonUrl = "biz";

export function getInfo(data) {
  return post("/RepairOrderProcess/Get", data, commonUrl);
}
export function add(data) {
  return post("/RepairOrderProcess/Create", data, commonUrl);
}
export function update(data) {
  return post("/RepairOrderProcess/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/RepairOrderProcess/Remove", data, commonUrl);
}
export function senderOrder(data) {
  return post("/RepairOrderProcess/Send", data, commonUrl);
}
