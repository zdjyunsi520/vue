import {get, post, put } from "@/utils/post";
const path = "/system/account/tbinfo/";
export function fetchList(data) {
    return get(path + "list", data);
}
//优质刷手
export function excellent(data) {
    return put(path + "quality", data);
}
//拉黑
export function block(data) {
    return put(path + "pullBlack", data);
}
//修改
export function update(data) {
    return put(path + "update", data);
}
//审核驳回
export function refuse(data) {
    return put(path + "turnDown", data);
}
//导出
export function exportExcel(data) {
    return get(path + "excel", data);
}