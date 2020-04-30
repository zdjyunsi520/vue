import {get, post, putForm, deleted } from "@/utils/post";
const path = "/system/merchant/";
//任务明细
export function fetchList(data) {
    return get(path + "tasks", data);
}
//任务明细  查看详情
export function detail(data) {
    return get("/system/task/" + data);
}
//可撤销订单
export function revokable(data) {
    return get("/system/orders/cancellable", data);
}
//根据任务好查询已撤销订单
export function revoke(data) {
    return get("/system/task/" + data + "/orders/cancelled");
}
//根据任务号查询进行中的订单
export function pending(data) {
    return get("/system/task/" + data + "/orders/doing");
}
//根据任务号查询已完成的订单
export function finished(data) {
    return get("/system/task/" + data + "/orders/finished");
}
//根据任务号查询待接的订单
export function waiting(data) {
    return get("/system/task/" + data + "/orders/pending");
}
export function exportExcel(data) {
    return get('/system/merchant/tasks/export', data)
}