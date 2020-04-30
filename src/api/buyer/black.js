import {get, deleted, post } from "@/utils/post";
const path = "/system/black/buyer/";
export function fetchList(data) {
    return get(path + "list", data);
}
//修改
export function del(data) {
    return deleted(path + "delete", data);
}
//禁用
export function dels(data) {
    return deleted(path + "deletelist", data);
}
//单独添加
export function add(data) {
    return post(path + "add", data);
}