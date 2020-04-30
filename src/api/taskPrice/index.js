import {get, post, put, deleted, putForm } from "@/utils/post";
const path = "/system/task/price/";
export function fetchList1(data) {
    return get(path + "TBlist", data);
}
export function fetchList2(data) {
    return get(path + "PDDlist", data);
}
export function fetchList3(data) {
    return get(path + "JDlist", data);
}
export function update(data, platformType) {
    return putForm(path + "update?platformType=" + platformType, data);
}
export function del(data) {
    return deleted(path + "delete", data);
}
export function dels(data) {
    return deleted(path + "deletelist", data);
}