import { post } from "@/utils/request";
const commonUrl = "report";

// 系统总览
export function getBaseInfo(data) {
    return post("/SituationSystem/Get", data, commonUrl);
}