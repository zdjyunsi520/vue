import {get } from "@/utils/post";
const path = "/system/task/price/additional_services/";
export function fetchList(data) {
    return get(path + "list", data);
}
export function update(data) {
    return get(path + "update", data);
}