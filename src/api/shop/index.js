import {get, post, put, deleted, putForm } from "@/utils/post";
const path = "/system/mer/store/";
export function fetchList(data) {
    return get(path + "list", data);
}
export function getInfoById(data) {
    return get(path + "find", data);
}

export function exportExcel(data) {
    return get(path + "transfer", data);
}
//修改
export function update(data) {
    return put(path + "update", data);
}
export function disabled(data) {
    return put(path + "disable", data);
}
export function del(data) {
    return deleted(path + "delete", data);
}
export function transfer(data) {
    return put(path + "transfer", data);
}

export function review(data) {
    return put(path + "by", data);
}
export function refuse(data) {
    return put(path + "turnDown", data);
}