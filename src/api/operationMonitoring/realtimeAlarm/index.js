import { post } from "@/utils/request";
const commonUrl = "Biz";

//巡视周期设置列表
export function fetchList(data) {
  return post("/Warning/Gets", data, commonUrl);
}
//新增巡视周期
export function add(data) {
  return post("/Warning/Create", data, commonUrl);
}
//修改巡视周期
export function update(data) {
  return post("/Warning/Modify", data, commonUrl);
}
//巡视周期详细
export function getInfo(data) {
  return post("/Warning/Get", data, commonUrl);
}
//删除巡视周期
export function deleted(data) {
  return post("/Warning/Remove", data, commonUrl);
}
