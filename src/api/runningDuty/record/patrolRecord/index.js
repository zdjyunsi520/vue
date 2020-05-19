import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/DutyPatrolRecord/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyPatrolRecord/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyPatrolRecord/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyPatrolRecord/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyPatrolRecord/Get", data, commonUrl);
}
