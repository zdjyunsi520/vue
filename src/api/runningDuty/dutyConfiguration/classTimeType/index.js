import { post } from "@/utils/request";
const commonUrl = "biz";

// 班次类型
export function fetchList(data) {
  return post("/DutyShiftType/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyShiftType/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyShiftType/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyShiftType/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyShiftType/Get", data, commonUrl);
}
