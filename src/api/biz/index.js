import { post } from "@/utils/request";
const commonUrl = "biz";

// 获取缺陷单列表信息
export function getAssetsBugs(data) {
    return post("/AssetsBug/Gets", data, commonUrl);
}
// 新增缺陷单信息
export function createAssetsBugs(data) {
    return post("/AssetsBug/Create", data, commonUrl);
}