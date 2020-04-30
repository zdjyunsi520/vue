import {get, putForm, postForm, deleted } from "@/utils/post";
const path = "/system/register/buyer/";
export function fetchList(data) {
    return get(path + 'switch', data);
}
//修改
export function update(data) {
    return putForm(path + "switch", data);
}

export function fetchList1(data) {
    return get(path + 'limit', data);
}
//修改
export function update1(data) {
    return putForm(path + "limit", data);
}
//添加
export function add(data) {
    return postForm(path + "limit", data);
}
//删除
export function deleteData(data) {
    return deleted(path + "limit?id=" + data.id);
}