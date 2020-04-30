import {get, post, postForm } from "@/utils/post";
const path = "/system/backstage/recharge/";
export function recharge(data) {
    return post(path + "mer", data);
}
export function typeTransfer(data) {
    return postForm(path + "mer/account/transfer", data);
}