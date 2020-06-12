import { post } from "@/utils/request";
const commonUrl = "report";

// 实时监控数据
export function getMeasureData (data) {
    return post("/RealTimeMonitor/GetMeasureData", data, commonUrl);
}
// 获取测量值历史数据
export function getMeasureDataHistory (data) {
    return post("/RealTimeMonitor/GetMeasureHistoryData", data, commonUrl);
}
// 获取设备监控
export function getDeviceMonitor (data) {
    return post("/DeviceMonitor/Get", data, commonUrl);
}
// 根据用电单位获取配电室列表信息（用于下拉框）
export function getPowerRoomByTenantId (data) {
    return post("/EntityRelation/GetTenantSwitchRooms", data, "org");
}


// 获取摄像头列表
export function getMonitor (data) {
    return post("/VideoMonitor/GetMonitor", data, commonUrl);
}
// 获取摄像头播放地址
export function getPlayUrl (data) {
    return post("/VideoMonitor/GetPlayUrl", data, commonUrl);
}



// 值班统计
export function getDutyScheduleReport (data) {
    return post("/DutyScheduleReport/GetReport", data, commonUrl);
}

// 用户概况-基本信息
export function getBaseInfo (data) {
    return post("/SituationElectric/Get", data, commonUrl);
}

// 用户概况- 负荷
export function getElectricLoad (data) {
    return post("/SituationElectric/GetElectricLoad", data, commonUrl);
}

// 用户概况-用电情况
export function getElectricQuantity (data) {
    return post("/SituationElectric/GetElectricQuantity", data, commonUrl);
}
// 用户概况- 电量构成
export function getElectricSituation (data) {
    return post("/SituationElectric/GetElectricSituation", data, commonUrl);
}

// 系统总览-基本数据
export function getSysBaseInfo (data) {
    return post("/SituationSystem/Get", data, commonUrl);
}

// 系统总览-负荷
export function getSysElectricLoad (data) {
    return post("/SituationSystem/GetElectricLoad", data, commonUrl);
}
// 系统总览-用电情况
export function getSysElectricSituation (data) {
    return post("/SituationSystem/GetElectricSituation", data, commonUrl);
}

// 系统大屏-基本数据 
export function getScreenSystem () {
    return post("/ScreenSystem/Get", {}, commonUrl);
}
// 系统大屏-负荷
export function getScreenElectricLoad () {
    return post("/ScreenSystem/GetElectricLoad", {}, commonUrl);
}

// 系统大屏-运维跟踪
export function getOperationCurve () {
    return post("/ScreenSystem/GetOperationCurve", {}, commonUrl);
}
// 系统大屏-预警
export function getWarnings () {
    return post("/ScreenSystem/GetWarnings", {}, commonUrl);
}


// 用户大屏-基本
export function getScreenTenant () {
    return post("/ScreenTenant/Get", {}, commonUrl);
}

// 用户大屏-用电情况
export function getScreenElectricSituation () {
    return post("/ScreenTenant/GetElectricSituation", {}, commonUrl);
}
// 用户大屏-负荷
export function getTenantElectricLoad () {
    return post("/ScreenTenant/GetElectricLoad", {}, commonUrl);
}

// 用户大屏-电费
export function getElectricFeeCurve () {
    return post("/ScreenTenant/GetElectricFeeCurve", {}, commonUrl);
}
