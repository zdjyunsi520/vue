import { post } from "@/utils/request";
const commonUrl = "biz";

// 
export function getInfo (data) {
  return post("/ProcessBug/Get", data, commonUrl);
}
export function add (data) {
  return post("/ProcessBug/Create", data, commonUrl);
}
export function update (data) {
  return post("/ProcessBug/Modify", data, commonUrl);
}
export function deleted (data) {
  return post("/ProcessBug/Remove", data, commonUrl);
}
export function senderOrder (data) {
  return post("/ProcessBug/Send", data, commonUrl);
}
export function backOrder (data) {
  return post("/ProcessBug/Backward", data, commonUrl);
}
