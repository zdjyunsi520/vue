<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="用户类型">
            <el-radio-group v-model="form.userType">
                <el-radio :label="1" :value="1">买手</el-radio>
                <el-radio :label="2" :value="2">推广员</el-radio>
                <el-radio :label="3" :value="3">分站</el-radio>
                <el-radio :label="4" :value="4">商家</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
            <el-input v-model="form.userId"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="userPhone">
            <el-input v-model="form.userPhone"></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
            <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
            <el-input v-model="form.orderNo"></el-input>
        </el-form-item>
        <el-form-item label="交易事由" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item class="xl-padding-left">
            <el-button :loading="loading" type="success" @click="handleSubmit">提交</el-button>
            <el-button type="warning" @click="handleOpen">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapState } from "vuex";
import { recharge } from "@/api/frontRecharge/bank";
import { validMoney } from "@/utils/validate";
export default {
    name: "银行卡充值",
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            remark: [emptyRule],
            amount: [
                {
                    required: true,
                    trigger: "blur",
                    validator: (rule, value, callback) => {
                        if (!validMoney(value)) {
                            callback(new Error("这里出了点问题"));
                        } else {
                            callback();
                        }
                    }
                }
            ]
        };
        const form = {
            userType: 1,
            userId: "",
            userPhone: "",
            orderNo: "",
            amount: "",
            remark: ""
        };
        return {
            form,
            form1: form,
            rules,
            loading: false
        };
    },
    created() {
        this.handleOpen();
    },

    methods: {
        create() {
            this.form = Object.assign({}, this.form1);
        },
        handleOpen() {
            this.loading = false;
            this.create();
        },
        handleSubmit() {
            if (this.form.userId || this.form.userPhone) {
                this.$refs.form.validate(v => {
                    if (v) {
                        this.loading = true;
                        var o = recharge;

                        o(this.form)
                            .then(r => {
                                this.$message.success(r.msg);
                                this.handleOpen();
                            })
                            .finally(() => (this.loading = false));
                    }
                });
            } else {
                this.$message.error("用户ID或用户手机号必须填一个");
            }
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
/deep/.el-textarea,
.xl-padding-left {
    width: 45%;
    .el-input {
        width: 100%;
    }
}
.xl-padding-left {
    text-align: center;
    margin-left: 100px;
}
/deep/.el-form-item__error {
    left: 45%;
}
</style>
