<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="金额" prop="amount">
            <el-input v-model="form.amount" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
            <el-input type="textarea" :rows="4" v-model="form.note" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item class="xl-padding-left">
            <el-button :loading="loading" type="success" @click="handleSubmit">提交</el-button>
            <el-button :loading="loading" type="warning" @click="handleOpen">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { getRid as recharge } from "@/api/frontRecharge/profitGetRid";
import { validMoney } from "@/utils/validate";
export default {
    name: "扣除平台利润",
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            merAccount: [emptyRule],
            orderNo: [emptyRule],
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
            ],
            note: [emptyRule]
        };
        const form = {
            amount: "",
            note: ""
        };
        return {
            form,
            form1: form,
            rules,
            loading: false
        };
    },
    created() {
        this.create();
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
            this.loading = true;
            this.$refs.form.validate(v => {
                if (v) {
                    var o = recharge;

                    o(this.form)
                        .then(res => {
                            this.$message.success(res.msg);
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