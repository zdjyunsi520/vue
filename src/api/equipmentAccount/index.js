import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getGetEmployee(data) {
  return post("/Employee/Gets", data, commonUrl);
}
// 关联设备
export function fetchDevice(data) {
  return post("/EntityRelation/GetMeterList", data, "org");
}
