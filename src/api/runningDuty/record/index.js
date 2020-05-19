import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/DutyRecord/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyRecord/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyRecord/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyRecord/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyRecord/Get", data, commonUrl);
}
