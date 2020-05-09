import { post } from "@/utils/request";
const commonUrl = "Org";

// 用电单位列表
export function getGetHierarchicalDtos() {
    return post("/Tenant/GetHierarchicalDtos", {}, commonUrl);
}

// 用电人员列表
export function getGetEmployee(data) {
    return post("/Employee/Gets", data, commonUrl);
}

// 获取设备关系树状图
export function getTrees() {
    return post("/EntityRelation/GetTrees", {}, commonUrl);
}