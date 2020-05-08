import { post } from "@/utils/request";
const commonUrl = "Dev";

// 用电人员列表
export function getGetEmployee(data) {
    return post("/Employee/Gets", data, commonUrl);
}