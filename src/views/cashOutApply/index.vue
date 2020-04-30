<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="我的可用余额">
            ￥ {{amount}} 元
        </el-form-item>
        <el-form-item label="提现金额" prop="withdrawAmount">
            <el-input v-model="form.withdrawAmount" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="提现密码" prop="password">
            <el-input v-model="form.password" type="password" autocomplete="off" placeholder=""></el-input>
            <el-button v-hasPermi="['system:withdraw:centre:updatePassword']" @click="handleOpenUpdatePwd">修改提现密码</el-button>
        </el-form-item>
        <el-form-item>
            <el-button v-hasPermi="['system:withdraw:centre:withdrawAppayFor']" class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">提现申请</el-button>
        </el-form-item>
        <updatePwd ref="updatePwd"></updatePwd>
    </el-form>
</template>

<script>
import { add, amount } from "@/api/cashOutApply";
import { validMoney } from "@/utils/validate";
import updatePwd from "./components/updatePwd";
export default {
    components: { updatePwd },
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            password: [emptyRule],
            withdrawAmount: [
                {
                    required: true,
                    trigger: "blur",
                    validator: (rule, value, callback) => {
                        if (validMoney(value)) {
                            callback();
                        } else {
                            callback(new Error("这里填写的不正确"));
                        }
                    }
                }
            ]
        };
        const form = {
            password: "",
            withdrawAmount: ""
        };
        return {
            form,
            form1: form,
            rules,
            loading: false,
            amount: 0
        };
    },
    created() {
        this.create();
    },
    methods: {
        create() {
            this.form = Object.assign({}, this.form1);
            this.getAmount();
        },
        getAmount() {
            amount().then(r => {
                this.amount = r.data.deptUsableProfit;
            });
        },
        handleOpen() {
            this.loading = false;
            this.create();
        },
        handleSubmit() {
            this.loading = true;
            this.$refs.form.validate(v => {
                if (v) {
                    var o = add;
                    o(this.form)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.amount -= this.form.withdrawAmount;
                            this.handleOpen();
                        })
                        .catch(e => {
                            this.loading = false;
                        });
                } else {
                    this.loading = false;
                }
            });
        },
        handleOpenUpdatePwd() {
            this.$refs.updatePwd.dialogVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.el-form {
    margin-top: 20px;
}
.xl-form-item-button {
    margin-left: 120px;
}
/deep/.el-form-item__label {
    width: 120px;
    font-weight: normal;
}
/deep/.el-input,
/deep/.el-select {
    width: 200px;
    .el-input {
        width: 100%;
    }
}
/deep/.el-form-item__error {
    left: 170px;
}
.xl-width-150 {
    width: 100px;
}
/deep/.el-input__inner {
    width: 100%;
}
</style>