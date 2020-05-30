import { post } from "@/utils/request";
const commonUrl = "biz";

// 实时监控数据
export function getInfo(data) {
  return post("/ReceiveBug/Get", data, commonUrl);
}
export function add(data) {
  return post("/ReceiveBug/Create", data, commonUrl);
}
export function update(data) {
  return post("/ReceiveBug/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/ReceiveBug/Remove", data, commonUrl);
}
export function senderOrder(data) {
  return post("/ReceiveBug/Send", data, commonUrl);
}
export function backOrder(data) {
  return post("/ReceiveBug/Backward", data, commonUrl);
}
