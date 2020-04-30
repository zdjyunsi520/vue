import { get } from "@/utils/post";
export function ossConifg() {
  return get("/system/common/ver");
}
