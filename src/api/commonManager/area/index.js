import { post } from "@/utils/request";
const commonUrl = "common";
// 获取地区列表
export function fetchList (data) {
    return post("/Area/GetTree", data, commonUrl);
}
// 获取地区信息详情
export function getInfo (data) {
    return post("/Area/Get", data, commonUrl);
}
// 添加地区信息
export function add (data) {
    return post("/Area/Create", data, commonUrl);
}
// 编辑地区信息
export function update (data) {
    return post("/Area/Modify", data, commonUrl);
}
// 删除地区信息
export function deleted (data) {
    return post("/Area/Remove", data, commonUrl);
}