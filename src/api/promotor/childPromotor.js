import {get } from "@/utils/post";
export function fetchList(data) {
    const exId = data.exId
    const exAccount = data.exAccount
    return exId ? fetchListById({ exId }) : fetchListByAccount({ exAccount })
}

function fetchListById(data) {
    return get("/system/management/Extension/subordinate-extension-id", data);
}

function fetchListByAccount(data) {
    return get("/system/management/Extension/subordinate-extension-account", data);
}