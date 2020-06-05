import { get } from "@/utils/post";
//登录验证码
export function loginPwd (data) {
  return get("/system/getLoginCode", data);
}
//编辑提现验证码
export function updateCashOutPwd () {
  return get("/system/withdraw/centre/updatePasswordCode");
}
//判断是否需要登录验证码
export function checkNeedSms (data) {
  return get("/system/isVerificationCode", data);
}
