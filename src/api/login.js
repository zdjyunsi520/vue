import { request, post } from "@/utils/request";
const commonUrl = "common";
// 登录方法
export function login(data) {
  return post("/userlogin/login", data, commonUrl);
}

// 获取用户详细信息
export function getInfo1() {
  return post("/User/GetUser", {}, commonUrl);
}
// 获取用户详细信息
export function getInfo() {
  return post("/UserModule/Gets", {}, commonUrl);
}
// 获取菜单
export function getSidebar() {
  return post("/UserModule/Gets", null, commonUrl);
}
// 退出方法
export function logout() {
  return request({
    url: "/system/logout",
    method: "post"
  });
}

export function updatePassword(data) {
  return request({
    url:
      "/system/deptLeader/" +
      (data.sts == 0 ? "updatePassword" : "updateBindPassword"),
    method: "post",
    params: data
  });
}

//获取首页推广信息
export function getIndexInfo() {
  return request({
    url: "/system/index/selectDeptStatistics",
    method: "get"
  });
}

// 忘记密码
export function forgetPwd(data) {
  return post("/UserLogin/ForgotPassword", data, "common");
}
// 忘记密码
export function getMessage(data) {
  return post("/VerificationCode/SendCode", data, "tool");
}
