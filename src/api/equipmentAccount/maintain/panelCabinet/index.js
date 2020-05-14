import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/Cabinet/Get", data, "org");
}
export function add(data) {
  return post("/Cabinet/Create", data, "org");
}

export function update(data) {
  return post("/Cabinet/Modify", data, "org");
}
export function deleted(data) {
  return post("/Cabinet/Remove", data, "org");
}
