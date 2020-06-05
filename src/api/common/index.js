import { get, post, put, deleted } from "@/utils/post";
const path = "/system/management/Extension/";
export function fetchDept () {
    // return get("/system/dept/list");
    return get("/system/dept/get/sysDept");
}
export function fetchOrder (data) {
    return get("/system/complaint/buyer/taskname", data);
}
export function disabled (data) {
    return put(path + "updateState", data);
}

export function update (data) {
    return put(path + "updateBindInfo", data);
}
export function add (data) {
    return post(path + "insertExInfo", data);
}
export function pwd (data) {
    return put(path + "updatePassword", data);
}
//首页统计搜索
export function fetchTotalCount () {
    // return get("/system/dept/list");
    return get("/system/index/selectIndexStatistics");
}
//首页统计搜索
export function fetchRefuse (data) {
    // return get("/system/dept/list");
    return put("/system/dict/data/getDictList", data);
}
//首页统计搜索
export function fetchBank () {
    // return get("/system/dept/list");
    return get("/system/dict/data/dictType/sys_bank_name");
}