import {get, putForm } from "@/utils/post";
const path = "/system/merchant/";
export function fetchList(data) {
    return get(path + "appeals", data);
}
export function pass(data) {
    return putForm(path + "appeal/confirm", data);
}
export function refuse(data) {
    return putForm(path + "appeal/refuse", data);
}