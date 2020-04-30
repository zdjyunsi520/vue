import { get } from "@/utils/post";
const path = "/system/statistics/";
export function fetchList(data) {
  return get(path + "allDeptStatistics", data);
}

//查询订单利润列表
export function fetchOrderList(data) {
  return get("/system/orders/profit", data);
}
//查看订单利润详情
export function fetchOrderDetail(data) {
  return get("/system/order/profit_details", data);
}
//查看利润明细
export function fetchAllDetail(data) {
  return get("/system/profitDetail/list", data);
}

//查询平台财务情况
export function deptCondition(data) {
  return get("/system/platform/financical_situation", data);
}
//查询平台收入记录
export function deptIn(data) {
  return get("/system/platform/profit/records", data);
}
//查询平台订单汇总记录
export function deptOrder(data) {
  return get("/system/platform/statistics/order", data);
}

//查询今日平台资金交易统计
export function deptTodayHistory(data) {
  return get("/system/transaction/today", data);
}

//查询历史平台资金交易统计
export function deptCapitalHistory(data) {
  return get("/system/transaction/history", data);
}

//查询分站每日收入记录
export function dailyEarn(data) {
  return get("/system/profit/records", data);
}

//查询分站每日订单统计记录
export function dailyOrderCount(data) {
  return get("/system/order/records", data);
}
//导出利润明细
export function exportExcel(data) {
  return get("/system/profitDetail/export", data);
}

//导出订单利润
export function exportExcelOrder(data) {
  return get("/system/orders/profit/export", data);
}
