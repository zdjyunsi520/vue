import { post } from "@/utils/request";
const commonUrl = "dev";

// 获取通讯主机列表
export function getServers(data) {
    return post("/DataServer/Gets",data, commonUrl);
}

// 获取通讯主机详情信息
export function getServer(data) {
    return post("/DataServer/Get",data, commonUrl);
}