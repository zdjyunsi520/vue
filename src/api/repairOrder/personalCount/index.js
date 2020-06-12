import { post } from "@/utils/request";
const commonUrl = "report";

// 实时监控数据
export function userReportByYear(data) {
  return post("/RepairOrderReport/ReportByYear", data, commonUrl);
}
export function userReportByNature(data) {
  return post("/RepairOrderReport/ReportByLevelandSource", data, commonUrl);
}
export function userReportByExecute(data) {
  return post("/RepairOrderReport/ReportByComplete", data, commonUrl);
}
