import { post } from "@/utils/request";
const commonUrl = "biz";

//班组
export function fetchList(data) {
  return post("/DutyTeam/Gets", data, commonUrl);
}
export function add(data) {
  return post("/DutyTeam/Create", data, commonUrl);
}
export function update(data) {
  return post("/DutyTeam/Modify", data, commonUrl);
}

export function deleted(data) {
  return post("/DutyTeam/Remove", data, commonUrl);
}
export function getEmployees(data) {
  return post("/DutyTeam/GetUnusedEmployees", data, commonUrl);
}