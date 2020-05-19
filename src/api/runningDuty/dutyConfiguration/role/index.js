import { post } from "@/utils/request";
const commonUrl = "biz";

// 班次类型
export function fetchList(data) {
  return post("/DutyCharacter/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyCharacter/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyCharacter/Modify", data, commonUrl);
}
export function deleted(data) {
  return post("/DutyCharacter/Remove", data, commonUrl);
}
export function getInfo(data) {
  return post("/DutyCharacter/Get", data, commonUrl);
}
