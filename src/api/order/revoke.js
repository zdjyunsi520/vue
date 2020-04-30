import {get, post, putForm, deleted } from "@/utils/post";
const path = "/system/orders/";
export function fetchList(data) {
    return get(path + "cancelled", data);
}