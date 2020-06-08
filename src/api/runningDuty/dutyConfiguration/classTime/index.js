import { post } from "@/utils/request";
const commonUrl = "biz";

// 班次信息
export function fetchList (data) {
  return post("/DutyShift/Gets", data, commonUrl);
}
export function add (data) {
  return post("/DutyShift/Create", data, commonUrl);
}
export function update (data) {
  return post("/DutyShift/Modify", data, commonUrl);
}
export function deleted (data) {
  return post("/DutyShift/Remove", data, commonUrl);
}
export function getInfo (data) {
  return post("/DutyShift/Get", data, commonUrl);
}
