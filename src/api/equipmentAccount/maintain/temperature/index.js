import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getInfo(data) {
  return post("/ThermoMeter/Get", data, commonUrl);
}
export function add(data) {
  return post("/ThermoMeter/Create", data, commonUrl);
}

export function update(data) {
  return post("/ThermoMeter/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/ThermoMeter/Remove", data, commonUrl);
}
