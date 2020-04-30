import {get, post } from "@/utils/post";
const path = "/system/feedback/dispose/";
export function fetchList(data) {
    return get(path + "selectFeedback", data);
}
export function reply(data) {
    return post(path + "updateFeedback", data);
}