import request from "@/utils/request";

// 登录方法
export function login(username, password, code, uuid) {
    const data = {
        username,
        password,
        code,
        uuid
    };
    return request({
        url: "/system/login",
        method: "post",
        params: data
    });
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: "/system/getInfo",
        method: "get"
    });
}

// 退出方法
export function logout() {
    return request({
        url: "/system/logout",
        method: "post"
    });
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: "/system/common/captchaImage",
        // url: '/buyer/start/getOss',
        method: "get"
            // method: 'post'
    });
}

export function updatePassword(data) {

    return request({
        url: '/system/deptLeader/' + (data.sts == 0 ? 'updatePassword' : 'updateBindPassword'),
        method: 'post',
        params: data
    })
}

//获取首页推广信息
export function getIndexInfo() {
    return request({
        url: "/system/index/selectDeptStatistics",
        method: "get"
    });
}