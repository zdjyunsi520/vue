import {get } from "@/utils/post";
const path = "/system/escape_single/";
export function fetchList(data) {
    return get(path + 'list', data);
}
export function exportExcel(data) {
    return get('/system/escape_single/exprot', data)
}