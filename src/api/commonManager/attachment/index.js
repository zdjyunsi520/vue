import { post } from "@/utils/request";
const commonUrl = "common";
// 获取模块列表
export function fetchList(data) {
  return post("/AttachmentType/Gets", data, commonUrl);
}
// 删除
export function deleted(data) {
  return post("/AttachmentType/Remove", data, commonUrl);
}
// 新增模块信息
export function add(data) {
  return post("/AttachmentType/Create", data, commonUrl);
}

// 修改模块信息
export function update(data) {
  return post("/AttachmentType/Modify", data, commonUrl);
}

// 修改模块信息
export function getInfo(data) {
  return post("/AttachmentType/Get", data, commonUrl);
}
