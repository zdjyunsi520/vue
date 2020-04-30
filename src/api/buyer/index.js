import {get, post, put } from "@/utils/post";
export function fetchList(data) {
    return get("/system/buyer/info/list", data);
}
//搜索买手下级
export function subordinate(data) {
    return put("/system/buyer/info/subordinate", data);
}
//拉黑
export function block(data) {
    return put("/system/buyer/info/black", data);
}
//修改
export function update(data) {
    return put("/system/buyer/info/update", data);
}
//禁用
export function disabled(data) {
    return put("/system/buyer/info/disable", data);
}
//导出
export function exportExcel(data) {
    return get("/account/Jdinfo/excel", data);
}

//担保审核
export function promise(data) {
    return put("/system/member/audit/guarantee", data);
}