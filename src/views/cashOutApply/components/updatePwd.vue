<template>
    <el-dialog width="800px" title="提现密码修改" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="新密码" prop="newWithdrawPassword">
                <el-input style="width:200px;" type="password" v-model="form.newWithdrawPassword" autocomplete="off" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item label="再次输入新密码" prop="againBindPassword">
                <el-input style="width:200px;" type="password" v-model="form.againBindPassword" autocomplete="off" placeholder="再次输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码" prop="code">
                <el-input style="width:200px;" v-model="form.code" autocomplete="off" placeholder="短信验证码"></el-input>
                <short-message ref="sms" :type="1"></short-message>

            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">确定</el-button>
            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { updatePwd } from "@/api/cashOutApply";
import { removeToken } from "@/utils/auth";
import shortMessage from "@/components/ShortMessage";
export default {
    components: { shortMessage },
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不得少于6位数哦"));
            } else {
                callback();
            }
        };
        const validatePassword1 = (rule, value, callback) => {
            if (value != this.form.newWithdrawPassword) {
                callback(new Error("两次密码不一样"));
            } else {
                callback();
            }
        };

        const form = {
            newWithdrawPassword: "",
            againBindPassword: ""
        };

        const rules = {
            newWithdrawPassword: [
                { required: true, trigger: "blur", validator: validatePassword }
            ],
            againBindPassword: [
                {
                    required: true,
                    trigger: "blur",
                    validator: validatePassword1
                }
            ],
            code: [
                {
                    required: true,
                    trigger: "blur",
                    message: "短信验证码不能为空"
                }
            ]
        };
        return {
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false
        };
    },

    mounted() {
        this.create();
    },
    methods: {
        create() {
            this.form = Object.assign({}, this.form1);
        },
        handleOpen() {
            this.dialogVisible = !this.dialogVisible;
            if (!this.dialogVisible) {
                this.loading = false;
                this.create();
            }
        },
        handleSubmit() {
            this.loading = true;
            this.$refs.form.validate(v => {
                if (v) {
                    updatePwd(this.form)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: res.msg
                            });
                            this.handleOpen();
                        })
                        .catch(e => {
                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog--center .el-dialog__body {
    padding: 25px 0 0;
}
/deep/.el-form-item__label {
    width: 30%;
}
/deep/.el-input,
/deep/.el-select {
    width: 45%;
    .el-input {
        width: 100%;
    }
}
/deep/.el-form-item__error {
    left: 45%;
}
/deep/.xl-line-height-initial {
    /deep/.el-form-item__label {
        width: 30%;
        line-height: initial;
    }
}
/deep/.el-form {
    width: 450px;
    margin: 0 auto;
}
</style>