import { post } from "@/utils/request";
const commonUrl = "report";

// 概况-基本信息
export function getBaseInfo(data) {
    return post("/SituationElectric/Get", data, commonUrl);
}

// 概况- 负荷
export function getElectricLoad(data) {
    return post("/SituationElectric/GetElectricLoad", data, commonUrl);
}

// 概况-用电情况
export function getElectricQuantity(data) {
    return post("/SituationElectric/GetElectricQuantity", data, commonUrl);
}
// 概况- 电量构成
export function getElectricSituation(data) {
    return post("/SituationElectric/GetElectricSituation", data, commonUrl);
}