import { postForm } from "@/utils/post";
const path = "/system/backstage/recharge/buyer/";
export function recharge(data) {
    return postForm(path + "income", data);
}
export function cashOut(data) {
    return postForm(path + "expenditure", data);

}