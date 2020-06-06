import { post } from "@/utils/request";
const commonUrl = "report";

// 实时监控数据
export function getMeasureData(data) {
    return post("/RealTimeMonitor/GetMeasureData", data, commonUrl);
}
// 获取测量值历史数据
export function getMeasureDataHistory(data) {
    return post("/RealTimeMonitor/GetMeasureHistoryData", data, commonUrl);
}
// 获取设备监控
export function getDeviceMonitor(data) {
    return post("/DeviceMonitor/Get", data, commonUrl);
}
// 根据用电单位获取配电室列表信息（用于下拉框）
export function getPowerRoomByTenantId(data) {
    return post("/EntityRelation/GetTenantSwitchRooms", data, "org");
}

// 值班统计
export function getDutyScheduleReport(data) {
    return post("/DutyScheduleReport/GetReport", data, commonUrl);
}