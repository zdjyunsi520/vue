import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/DataServer/Get", data, commonUrl);
}
export function getCommunicateList(data) {
  return post("/DataServer/Gets", data, commonUrl);
}
