import {get } from "@/utils/post";
const path = "/system/orders/";
export function fetchList(data) {
    return get(path + "buyer_cancelled", data);
}