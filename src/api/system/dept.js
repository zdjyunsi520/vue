import request from "@/utils/request";
import {get, post, put, deleted } from "@/utils/post";
// 查询分站列表
export function listDept(query) {
    return request({
        url: "/system/dept/list",
        method: "get",
        params: query
    });
}

// 查询分站详细
export function getDept(deptId) {
    return request({
        url: "/system/dept/" + deptId,
        method: "get"
    });
}

// 查询分站下拉树结构
export function treeselect() {
    return request({
        url: "/system/dept/treeselect",
        method: "get"
    });
}

// 根据角色ID查询分站树结构
export function roleDeptTreeselect(roleId) {
    return request({
        url: "/system/dept/roleDeptTreeselect/" + roleId,
        method: "get"
    });
}

// 新增分站
export function addDept(data) {
    return request({
        url: "/system/dept",
        method: "post",
        data: data
    });
}

// 修改分站
export function updateDept(data) {
    return request({
        url: "/system/dept",
        method: "put",
        data: data
    });
}

// 删除分站
export function delDept(deptId) {
    return request({
        url: "/system/dept/" + deptId,
        method: "delete"
    });
}
//分站管理 查询商家信息
export function fetchMerchantList(data) {
    return post("/system/deptmer/selectMerConfigList", data);
}
//分站管理 修改商家信息
export function updateMerchant(data) {
    return post("/system/deptmer/updateMerConfig", data);
}
//分站管理 查询推广信息
export function fetchPromotorList(data) {
    return get("/system/deptex/list", data);
}
//分站管理 修改推广信息
export function updateEx(data) {
    return post("/system/deptex/ico", data);

}
//分站管理 查询分站利润信息
export function fetchExList(data) {
    return get("/system/sysOrderCommissionConfig/commList", data);
}

//分站管理 修改分站利润信息
export function updateExList(data) {
    return get("/system/sysOrderCommissionConfig/updateComm", data);
}

const manageInfo = '/system/deptLeader/'
    //分站管理 查看管理员信息
export function fetchManagerList(data) {
    return get(manageInfo + "list", data);
}
//分站管理 修改管理员信息
export function updateManagerInfo(data) {
    return post(manageInfo + "update", data);
}
//分站管理 新增管理员信息
export function addManagerInfo(data) {
    return post(manageInfo + "add", data);
}
//分站管理 删除管理员信息
export function deleteManagerInfo(data) {
    return post(manageInfo + "delete", data);
}


const cashOutInfo = '/system/withdraw/centre/'
    //分站管理 查看收款卡信息
export function fetchCashOutList(data) {
    return get(cashOutInfo + "bankList", data);
}
//分站管理 修改分收款卡信息
export function updateCashOutInfo(data) {
    return post(cashOutInfo + "updateBank", data);
}
//分站管理 新增分收款卡信息
export function addCashOutInfo(data) {
    return post(cashOutInfo + "addBank", data);
}
//分站管理 删除分收款卡信息
export function deleteCashOutInfo(data) {
    return post(cashOutInfo + "deleteBank", data);

}