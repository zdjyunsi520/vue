<template>
    <el-dialog width="800px" :title="'添加推广员'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        <el-form :model="form" ref="form" :rules="rules">

            <el-form-item label="用户名" prop="exAccountName">
                <el-input style="width:400px;" v-model="form.exAccountName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="exAccount">
                <el-input style="width:400px;" v-model="form.exAccount" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
                <el-input style="width:400px;" v-model="form.qq" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input style="width:400px;" v-model="form.password" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="订单抽成比例" prop="orderProportion">
                <el-input style="width:400px;" v-model="form.orderProportion" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="分站佣金比例" prop="orderProportion1">
                {{form.orderProportion1}}
            </el-form-item>
            <el-form-item label="是否允许二级分销" prop="isSecond">
                <el-radio-group v-model="form.isSecond">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="网站标识" prop="deptId">
                <el-select v-model="form.deptId">
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptList" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input style="width:400px;" v-model="form.note" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">保存</el-button>

            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { fetchDept } from "@/api/common";
import { add } from "@/api/promotor";
import { validPhone } from "@/utils/validate";
export default {
    components: {},
    data() {
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error("密码不得少于6位数哦"));
            } else {
                callback();
            }
        };
        const validatePassword1 = (rule, value, callback) => {
            if (value != this.form.newPassword) {
                callback(new Error("两次密码不一样"));
            } else {
                callback();
            }
        };

        const form = {
            exAccount: "",
            exAccountName: "",
            orderProportion: "",
            password: "",
            qq: "",
            isSecond: 1,
            deptId: "",
            orderProportion1: "",
            note: ""
        };

        const rules = {
            exAccount: [
                {
                    required: true,
                    trigger: "blur",
                    validator: (rule, value, callback) => {
                        if (validPhone(value)) {
                            callback();
                        } else {
                            callback(new Error("此处填写有误"));
                        }
                    }
                }
            ],
            exAccountName: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            password: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],

            orderProportion: [
                {
                    required: true,
                    trigger: "blur",
                    validator: (rule, value, callback) => {
                        if (!value || isNaN(value) || parseFloat(value) < 0) {
                            callback(new Error("此处填写有误"));
                        } else {
                            callback();
                        }
                    }
                }
            ],
            qq: [{ required: true, trigger: "blur", message: "此处不能为空" }],
            deptId: [{ required: true, trigger: "blur", message: "请选择" }]
        };
        return {
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false,
            deptList: null
        };
    },
    computed: {
        ...mapState(["user"])
    },

    created() {
        this.create();
        this.getDept();
    },
    methods: {
        create() {
            this.form = Object.assign({}, this.form1);
        },
        getDept() {
            fetchDept().then(r => {
                this.deptList = r.data;
            });
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
                    add(this.form)
                        .then(res => {
                            this.$emit("getList");
                            this.$message.success(res.msg);
                            this.handleOpen();
                        })
                        .catch(e => {
                            this.loading = false;
                        })
                        .finally(e => {});
                } else {
                    this.loading = false;
                }
            });
        }
    },
    watch: {
        "form.orderProportion"(v) {
            const cha =
                this.user.deptCommisionRate * 100 -
                parseInt(parseFloat(this.form.orderProportion) * 100);
            if (isNaN(cha) || cha < 0) {
                this.form.orderProportion1 = "";
            } else {
                this.form.orderProportion1 = cha / 100;
            }
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
/deep/.el-input__inner {
    width: 75%;
}
</style>