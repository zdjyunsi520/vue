import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/ElectricMeter/Get", data, commonUrl);
}
export function add(data) {
  return post("/ElectricMeter/Create", data, commonUrl);
}

export function update(data) {
  return post("/ElectricMeter/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/ElectricMeter/Remove", data, commonUrl);
}
