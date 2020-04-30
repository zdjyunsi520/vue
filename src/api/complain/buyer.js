import {get, putForm } from "@/utils/post";
const path = "/system/buyer/appeal";
export function fetchList(data) {
    return get(path + "s", data);
}
export function pass(data) {
    return putForm(path + "/confirm", data);
}
export function refuse(data) {
    return putForm(path + "/refuse", data);
}