import {get, post, put, deleted } from "@/utils/post";
const path = "/system/account/buyerInfo/";
export function fetchList(data) {
    return get(path + "list", data);
}
export function getInfoById(data) {
    return get(path + "find", data);
}
export function disabled(data) {
    return put(path + "disable", data);
}
//拉黑
export function block(data) {
    return put(path + "black", data);
}
//修改
export function update(data) {
    return get(path + "update", data);
}
export function del(data) {
    return put(path + "delete", data);
}