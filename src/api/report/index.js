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