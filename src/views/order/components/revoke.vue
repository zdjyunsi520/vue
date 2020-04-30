<template>
    <el-row>
        <!-- 充值信息填写 -->
        <el-dialog width="800px" :title="'订单撤销'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="撤销类型" prop="radio">
                    <el-radio-group v-model="form.radio">
                        <el-radio :label="0" :disabled="form.orderNos.length>1">撤买手单（换买手做单）</el-radio>
                        <el-radio :label="1">撤商家单（退款，任务撤销）</el-radio>
                        <el-radio :label="2" :disabled="form.orderNos.length>1">撤销订单（佣金照给）</el-radio>
                        <el-radio :label="3" :disabled="form.orderNos.length>1">撤销追评</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="理由" prop="reason" class="xl-text-align">
                    <el-input type="textarea" v-model="form.reason" autocomplete="off" placeholder="" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="loading" type="warning" @click="handleSubmit">提交</el-button>
                <el-button @click="handleOpen">取消</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import {
    revoke,
    revokeBuyer,
    revokeMoney,
    revokeAddEvaluation
} from "@/api/order/order";
import { validPrice } from "@/utils/validate";
export default {
    data() {
        const form = {
            reason: "",
            orderNos: [],
            orderNo: "",
            radio: ""
        };
        const rules = {
            radio: [{ required: true, message: "请选择撤销类型" }],
            reason: [{ required: true, message: "请选择撤销原因" }],
            agioAmount: [
                {
                    required: true,
                    trigger: "blur",
                    validator: (rule, value, callback) => {
                        if (validPrice(value)) {
                            callback();
                        } else {
                            callback(new Error("金额填写有误"));
                        }
                    }
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
    watch: {
        "form.orderNos"(v) {
            if (v.length > 1) {
                this.form.radio = 1;
            } else {
                this.form.radio = "";
            }
        }
    },
    created() {
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
            this.$refs.form.validate(v => {
                if (v) {
                    this.loading = true;
                    var o;
                    if (this.form.radio == 1) {
                        o = revoke;
                    } else {
                        this.form.orderNo = this.form.orderNos[0];
                        if (this.form.radio == 0) o = revokeBuyer;
                        else if (this.form.radio == 2) o = revokeMoney;
                        else o = revokeAddEvaluation;
                    }

                    o(this.form)
                        .then(res => {
                            this.$emit("getList");
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
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
/deep/.el-input {
    width: 100px;
    display: inline-block;
    /deep/.el-input__inner {
        width: 100%;
    }
}
.xl-text-align {
    text-align: center;
}
/deep/.el-dialog__body {
    padding-bottom: 0px;
}
/deep/.el-form-item__error {
    left: 120px;
}
</style>
