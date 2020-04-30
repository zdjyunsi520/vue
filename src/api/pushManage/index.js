import {get, post, put, deleted } from "@/utils/post";
const path = "/system/jiguang/push/";
export function all(data) {
    return post(path + "pushAll", data);
}

export function androidAll(data) {
    return post(path + "pushAndroidAll", data);
}

export function androidOne(data) {
    return post(path + "pushAndroidId", data);
}
export function iosAll(data) {
    return post(path + "pushIosAll", data);
}
export function iosOne(data) {
    return post(path + "pushIosId", data);
}