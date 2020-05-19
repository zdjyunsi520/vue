import { post } from "@/utils/request";
const commonUrl = "report";

// 实时监控数据
export function getMeasureData (data) {
    return post("/RealTimeMonitor/GetMeasureData", data, commonUrl);
}
