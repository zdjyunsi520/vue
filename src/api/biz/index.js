import { post, postFile } from "@/utils/request";
const commonUrl = "biz";

// 获取缺陷单列表信息
export function getAssetsBugs(data) {
  return post("/AssetsBug/Gets", data, commonUrl);
}
// 新增缺陷单信息
export function add(data) {
  return post("/AssetsBug/Create", data, commonUrl);
}

// 修改缺陷单信息
export function update(data) {
  return post("/AssetsBug/Modify", data, commonUrl);
}
// 获取缺陷单详情
export function getInfo(data) {
  return post("/AssetsBug/Get", data, commonUrl);
}
// 删除缺陷单信息
export function deleted(data) {
  return post("/AssetsBug/Remove", data, commonUrl);
}

// 上传附件
export function imageUpload(data) {
  return postFile("/File/Url", data, "common");
}

// 统计-年
export function bugReportByYear(data) {
  return post("/AssetsBugReport/ReportByYear", data, "Report");
}
// 统计-缺陷等级
export function bugReportByRank(data) {
  return post("/AssetsBugReport/ReportByRank", data, "Report");
}
//统计-消缺率
export function bugReportByRate(data) {
  return post("/AssetsBugReport/ReportByRate", data, "Report");
}
