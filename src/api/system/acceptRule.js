import {get, put } from "@/utils/post";
const path = "/system/config/"
    //查询接单规则
export function getAcceptRule(data) {
    return get(path + "find/receive_order_rule", data);
}

//修改接单规则
export function updateAcceptRule(data) {
    return put(path + "update/receive_order_rule", data);
}

//查询是否允许外挂接单
export function plugInRule(data) {
    return get(path + "assister_switch", data);
}

//查询是否允许外挂接单
export function updatePlugInRule(data) {
    return put(path + "assister_switch", data);
}