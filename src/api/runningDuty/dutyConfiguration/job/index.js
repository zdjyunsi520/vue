import { post } from "@/utils/request";
const commonUrl = "biz";

// 值班岗位
export function fetchList(data) {
    return post("/DutyPosition/Gets", data, commonUrl);
}
export function add(data) {
    return post("/DutyPosition/Create", data, commonUrl);
}
export function update(data) {
    return post("/DutyPosition/Modify", data, commonUrl);
}
export function deleted(data) {
    return post("/DutyPosition/Remove", data, commonUrl);
}