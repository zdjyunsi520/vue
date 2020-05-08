import axios from "axios";
import { Notification, MessageBox } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";
import qs from "qs";
axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const emptyReg = /[\r\n\t\ ]+/g;

function transformRequest(data) {
    if (data) {
        const keys = Object.keys(data);
        keys.forEach(v => {
            let value = data[v];
            if (value) {
                const type = (typeof value).toLowerCase();
                if (type == "string" || type == "number") {
                    value = value.toString().trim();
                    if (type == "number") value = parseFloat(value);
                    data[v] = value;
                }
            }
        });
    }
    return data;
}
// 创建axios实例
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: process.env.VUE_APP_BASE_API,
    // 超时
    timeout: 60000,
    paramsSerializer(params) {
        params = transformRequest(params);
        return qs.stringify(params, { arrayFormat: "brackets" });
    }
});
// request拦截器
service.interceptors.request.use(
    config => {
        if (getToken()) {
            //config.headers["Token"] = getToken(); // 让每个请求携带自定义token
            // config.headers["version"] = "1.0";
            // config.headers["fromurl"] = "system";
        }

        return config;
    },
    error => {
        Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    res => {
        const code = res.data.code;
        if (code === 401) {
            // MessageBox.confirm(
            //     '长时间未操作，请重新登录',
            //     '系统提示', {
            //         confirmButtonText: '重新登录',
            //         type: 'warning'
            //     }
            // ).then(() => {
            //     store.dispatch('LogOut').then(() => {
            //         location.reload() // 为了重新实例化vue-router对象 避免bug
            //     })
            // })
            store.dispatch("LogOut").then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
            });
        } else if (code !== 0) {
            Notification.error({
                title: res.data.msg
            });
            return Promise.reject("error");
        } else {
            return res.data;
        }
    },
    error => {
        console.log("err" + error);
        Message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);

export function get(url, params) {
    return service({ url, method: "get", params });
}

export function post(url, params, baseUrl) {
    if (baseUrl) url = `http://api${baseUrl}t.xtioe.com${url}`;
    const token = getToken();
    if (token) {
        params.Token = token;
    }
    return service({ url, method: "post", params });
}
export function post1(url, data, baseUrl) {
    if (baseUrl) url = `http://api${baseUrl}t.xtioe.com${url}`;
    const token = getToken();
    if (token) {
        data.Token = token;
        data.version = "1.0";
        data.fromurl = "system";
    }

    return service({ url, method: "post", data });
}

export function put(url, params) {
    return service({ url, method: "put", params });
}
export function putJSON(url, data) {
    return service({ url, method: "put", data });
}

export function deleted(url, params) {
    return service({ url, method: "delete", params });
}

export default service;