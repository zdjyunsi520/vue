import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/SwitchingRoom/Get", data, "org");
}
export function add(data) {
  return post("/SwitchingRoom/Create", data, "org");
}

export function update(data) {
  return post("/SwitchingRoom/Modify", data, "org");
}
export function deleted(data) {
  return post("/SwitchingRoom/Remove", data, "org");
}
