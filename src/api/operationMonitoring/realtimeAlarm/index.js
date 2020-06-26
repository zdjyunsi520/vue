import { post } from "@/utils/request";
const commonUrl = "biz";

//实时告警-列表
export function fetchList(data) {
    return post("/Warning/Gets", data, commonUrl);
}

//历史告警-列表
export function fetHistorychList(data) {
    return post("/WarningHistory/Gets", data, commonUrl);
}

//实时告警-确认
export function confirm(data) {
    return post("/Warning/Confirm", data, commonUrl);
}