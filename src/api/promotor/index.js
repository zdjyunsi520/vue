import {get, post, put, deleted, putForm } from "@/utils/post";
const path = "/system/management/Extension/";
export function fetchList(data) {
    return get(path + "list", data);
}

export function disabled(data) {
    return put(path + "updateState", data);
}

export function update(data) {
    return putForm(path + "updateBindInfo", data);
}
export function add(data) {
    return post(path + "insertExInfo", data);
}
export function pwd(data) {
    return put(path + "updatePassword", data);
}
export function exportExcel(data) {
    return get(path + "excel", data);
}