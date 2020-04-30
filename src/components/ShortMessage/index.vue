<template>
    <div @click="getMessage">
        <el-button>{{countDown}}{{countDown>=0?' 秒':''}}</el-button>
    </div>
</template>

<script>
import { updateCashOutPwd, loginPwd } from "@/api/shortMessage";
import Cookies from "js-cookie";
import { validPhone } from "@/utils/validate";
export default {
    props: {
        type: { type: Number }
    },
    data() {
        return {
            countDownLimit: 120,
            countDown: "发送验证码",
            expireTime: 0,
            timer: null,
            form: {
                userName: ""
            }
        };
    },
    created() {
        this.checkSendSms();
    },
    methods: {
        getMessage() {
            if (this.timer) {
                return;
            }
            let o;
            if (!this.type) {
                if (!this.form.userName) {
                    this.$emit("setData");
                    return;
                }
                o = loginPwd;
            } else {
                o = updateCashOutPwd;
            }
            let dt = Date.now();
            this.expireTime = Date.now() + this.countDownLimit * 1000;
            Cookies.set("shortMessageCode", this.expireTime, {
                expires: 120 / (24 * 60 * 60)
            });
            this.startTimer();
            o(this.form)
                .then(r => {
                    this.$message.success("短信验证码已发送");
                })
                .catch(() => {
                    this.initSms();
                });
        },
        startTimer() {
            this.handleTimer();
            this.timer = setInterval(this.handleTimer, 1000);
        },
        handleTimer() {
            const dt = Date.now();
            if (this.expireTime <= dt) {
                this.initSms();
            } else {
                this.countDown = Math.floor((this.expireTime - dt) / 1000);
            }
        },
        initSms() {
            Cookies.set("shortMessageCode", 0, {
                expires: -1
            });
            this.timer = clearInterval(this.timer);
            this.countDown = "发送验证码";
        },
        checkSendSms() {
            this.expireTime = parseInt(Cookies.get("shortMessageCode"));
            let dt = Date.now();
            if (this.expireTime && this.expireTime > dt) {
                this.startTimer();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
div {
    display: inline-block;
    padding: 0 6px;
    width: 124px;
    button {
        width: 100%;
    }
}
</style>