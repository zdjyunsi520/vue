import { post } from "@/utils/request";
const commonUrl = "biz";

//  获取用户选择的排班信息
export function GetUserPositions (data) {
    return post("/DutyHandover/GetUserPositions", data, commonUrl);
}
export function update (data) {
    return post("/DutyRecord/Modify", data, commonUrl);
}
export function deleted (data) {
    return post("/DutyRecord/Remove", data, commonUrl);
}
export function getInfo (data) {
    return post("/DutyRecord/Get", data, commonUrl);
}
export function getShift (data) {
    return post("/DutySchedule/GetUserSchedule", data, commonUrl);
}
//获取当前用户交班表信息
export function DutyHandoverGetCurrent (data) {
    return post("/DutyHandover/GetCurrent", data, commonUrl);
}
//获取当前用户班组信息
export function DutyHandoverGetDutyTeam (data) {
    return post("/DutyHandover/GetDutyTeam", data, commonUrl);
}
export function GetShifts (data) {
    return post("/DutyHandover/GetShifts", data, commonUrl);
}
export function getCurrentInfo (data) {
    return post("/DutyHandover/GetCurrentInfo", data, commonUrl);
}