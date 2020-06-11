import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/DutySchedule/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutySchedule/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutySchedule/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutySchedule/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutySchedule/Get", data, commonUrl);
}
export function addByPosition(data) {
  return post("/DutySchedule/InitializeCreateByPosition", data, commonUrl);
}
export function addByPersonn(data) {
  return post("/DutySchedule/InitializeCreateByEmployee", data, commonUrl);
}
