import { post } from "@/utils/post";
const path = "/system/version/";
export function update(data) {
    return post(path + "addOrUpdateVersion", data);
}
export function fetchList(data) {
    return post(path + "selectVersion", data);
}