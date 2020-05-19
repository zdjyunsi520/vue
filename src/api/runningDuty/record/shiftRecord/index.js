import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/DutyHandover/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyHandover/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyHandover/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyHandover/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyHandover/Get", data, commonUrl);
}
