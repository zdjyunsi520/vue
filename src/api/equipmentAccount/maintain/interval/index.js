import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/Interval/Get", data, "org");
}
export function add(data) {
  return post("/Interval/Create", data, "org");
}

export function update(data) {
  return post("/Interval/Modify", data, "org");
}
export function deleted(data) {
  return post("/Interval/Remove", data, "org");
}
