import { post } from "@/utils/request";
const commonUrl = "report";

// 系统总览-基本数据
export function getBaseInfo(data) {
    return post("/SituationSystem/Get", data, commonUrl);
}

// 系统总览-负荷
export function getElectricLoad(data) {
    return post("/SituationSystem/GetElectricLoad", data, commonUrl);
}

// 系统总览-用电情况
export function getElectricSituation(data) {
    return post("/SituationSystem/GetElectricSituation", data, commonUrl);
}