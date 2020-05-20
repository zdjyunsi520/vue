import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班信息表
export function fetchList(data) {
  return post("/Duty/Gets", data, commonUrl);
}
export function add(data) {
  return post("/Duty/Create", data, commonUrl);
}
export function update(data) {
  return post("/Duty/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/Duty/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/Duty/Get", data, commonUrl);
}
