import request from "./request";
export function post(url, params) {
    return request({ url, method: "post", params });
}
export function get(url, params) {
    return request({ url, method: "get", params });
}

export function put(url, params) {
    return request({ url, method: "put", params });
}
export function putForm(url, data) {
    return request({ url, method: "put", data });
}
export function postForm(url, data) {
    return request({ url, method: "post", data });
}

export function deleted(url, params) {
    return request({ url, method: "delete", params });
}