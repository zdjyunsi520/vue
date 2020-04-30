import {get, post, put, deleted } from "@/utils/post";
const path = "/system/notice/buyer/";
export function fetchList(data) {
    return get(path + "list", data);
}
export function add(data) {
    return post(path + 'insert', data)
}
export function update(data) {
    return put(path + 'updateNotice', data)
}
export function disabled(data) {
    return put(path + 'updateStatus', data)
}
export function del(data) {
    return deleted(path + 'delete', data)
}