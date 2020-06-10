import { post } from "@/utils/request";
const commonUrl = "Biz";

//实时告警-列表
export function fetchList(data) {
    return post("/Warning/Gets", data, commonUrl);
}

//实时告警-确认
export function confirm(data) {
    return post("/Warning/Confirm", data, commonUrl);
}