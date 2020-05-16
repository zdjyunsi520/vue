import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/Smoke/Get", data, commonUrl);
}
export function add(data) {
  return post("/Smoke/Create", data, commonUrl);
}

export function update(data) {
  return post("/Smoke/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/Smoke/Remove", data, commonUrl);
}
