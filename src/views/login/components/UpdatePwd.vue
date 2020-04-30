<template>
    <el-dialog width="800px" :title="title+'密码修改'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        <el-form :model="form" ref="form" :rules="rules">

            <!-- <el-form-item class="xl-line-height-initial" label="密码类型">
        <el-switch style="display: block" v-model="form.sts" active-color="#409eff" inactive-color="#409eff" active-text="登录密码" inactive-text="提现密码" :active-value='0' :inactive-value='1'>
        </el-switch>
      </el-form-item> -->

            <el-form-item label="旧密码" prop="oldPassword">
                <el-input style="width:200px;" type="password" v-model="form.oldPassword" autocomplete="off" placeholder="旧密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input style="width:200px;" type="password" v-model="form.newPassword" autocomplete="off" placeholder="新密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="againPassword">
                <el-input style="width:200px;" type="password" v-model="form.againPassword" autocomplete="off" placeholder="再次输入新密码"></el-input>
            </el-form-item>
            <!-- <el-form-item label="短信验证码" prop="code">
        <el-input style="width:200px;" v-model="form.code" autocomplete="off" placeholder="短信验证码"></el-input>
        <short-message ref="sms" @validatePhone="validatePhone"></short-message>

      </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">确定</el-button>

            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { updatePassword } from "@/api/login";
import { removeToken } from "@/utils/auth";

export default {
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不得少于6位数哦"));
            } else {
                callback();
            }
        };
        const validatePassword1 = (rule, value, callback) => {
            if (value != this.form.newBindPassword) {
                callback(new Error("两次密码不一样"));
            } else {
                callback();
            }
        };

        const form = {
            deptId: "",
            oldPassword: "",
            sts: 0,
            newPassword: "",
            againPassword: "",
            userName: ""
        };

        const rules = {
            oldBindPassword: [
                { required: true, trigger: "blur", message: "旧密码不能为空" }
            ],
            newBindPassword: [
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
    computed: {
        ...mapState(["user"]),
        title() {
            return this.form.sts == 0 ? "登录" : "提现";
        }
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
                    this.form.deptId = this.user.deptId;
                    this.form.userName = this.user.userName;
                    updatePassword(this.form)
                        .then(res => {
                            this.$message({
                                type: "success",
                                message: res.msg
                            });
                            setTimeout(() => {
                                removeToken();
                                this.$router.push(`/login`);
                            }, 1500);
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
    width: 400px;
    margin: 0 auto;
}
</style>