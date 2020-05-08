import { post } from "@/utils/request";
const commonUrl = "Biz";

//巡视周期设置列表
export function getTableData(data) {
    return post("/PatrolCycle/Gets", data, commonUrl);
}