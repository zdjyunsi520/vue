import { postForm } from "@/utils/post";
const path = "/system/backstage/recharge/";
export function recharge(data) {
  return postForm(path + "platform", data);
}
