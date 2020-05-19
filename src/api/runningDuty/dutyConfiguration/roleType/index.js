import { post } from "@/utils/request";
const commonUrl = "biz";

// 班次类型
export function fetchList(data) {
  return post("/DutyCharaType/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyCharaType/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyCharaType/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyCharaType/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyCharaType/Get", data, commonUrl);
}
