import {get, post, putForm, deleted } from "@/utils/post";
const path = "/system/orders/";
export function fetchList(data) {
    return get(path + "platform_mer_cancelled", data);
}