import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/Monitor/Get", data, commonUrl);
}
export function add(data) {
  return post("/Monitor/Create", data, commonUrl);
}

export function update(data) {
  return post("/Monitor/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/Monitor/Remove", data, commonUrl);
}
