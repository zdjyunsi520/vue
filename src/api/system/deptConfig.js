import {get, putForm } from "@/utils/post";
const path = "/system/dept/config"
    //查询接单规则
export function getDeptConfig(data) {
    return get(path, data);
}

//查询接单规则
export function updateDeptConfig(data) {
    return putForm(path, data);
}