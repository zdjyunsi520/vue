import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/DutyHandoverRecord/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyHandoverRecord/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyHandoverRecord/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyHandoverRecord/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyHandoverRecord/Get", data, commonUrl);
}
