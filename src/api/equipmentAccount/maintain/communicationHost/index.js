import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/DataServer/Get", data, commonUrl);
}
export function add(data) {
  return post("/DataServer/Create", data, commonUrl);
}

export function update(data) {
  return post("/DataServer/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DataServer/Remove", data, commonUrl);
}
export function fetchList(data) {
  return post("/DataServer/Gets", data, commonUrl);
}