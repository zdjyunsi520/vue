import {get } from "@/utils/post";
export function orderList(data) {
    return get("/system/statistics/dept/orders", data);
}
export function thirdServiceList(data) {
    return get("/system/statistics/dept/third_service", data);
}