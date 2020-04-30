import {get } from "@/utils/post";
export function getWWInfo(data) {
    return get("/system/mirror/user/info", data);
}
export function getWWRange(data) {
    return get("/system/mirror/user/reputation", data);
}