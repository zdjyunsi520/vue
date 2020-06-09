import { post } from "@/utils/request";
const commonUrl = "biz";

// 270 获取当前用户所在班组的班次信息
export function GetShifts(data) {
  return post("/DutySchedule/GetShifts", data, commonUrl);
}
// 271 获取用户选择的排班信息
export function GetUserPositions(data) {
  return post("/DutySchedule/GetUserPositions", data, commonUrl);
}
export function update(data) {
  return post("/DutyRecord/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyRecord/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyRecord/Get", data, commonUrl);
}
export function getShift(data) {
  return post("/DutySchedule/GetUserSchedule", data, commonUrl);
}
//获取当前用户交班表信息
export function DutyHandoverGetCurrent(data) {
  return post("/DutyHandover/GetCurrent", data, commonUrl);
}
