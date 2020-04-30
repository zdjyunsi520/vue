import {get,post,putJSON,deleted} from "@/utils/request";

// 查询用户列表
export function listUser(query) {
  return get( "/system/user/list", query);
}

// 查询用户详细
export function getUser(userId) {
  return get(  "/system/user/" + userId, "get");
}

// 新增用户
export function addUser(data) {
  return post("/system/user",data);
}

// 修改用户
export function updateUser(data) {
  return putJSON( "/system/user",data);
}

// 删除用户
export function delUser(userId) {
  return deleted("/system/user/" + userId);
}

// 导出用户
export function exportUser(query) {
  return get("/system/user/export",query);
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  };
  return put("/system/user/resetPwd", data);
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  };
  return put("/system/user/changeStatus",data);
}





// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  };
  return put("/system/user/profile/updatePwd", data);
}


//查询用户权限信息
export function getUserRoles(params) {
  return get("/system/user/list/roles",params);
}
//修改用户权限信息
export function updateUserRoles(data) {
  return get("/system/user/list/update/roles",data);
}
