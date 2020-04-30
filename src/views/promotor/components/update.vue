<template>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" :title="'修改信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="用户名">
                {{form.exAccountName}}
            </el-form-item>
            <el-form-item label="手机号码" prop="storeName">
                <el-input v-model="form.exAccount" autocomplete="off" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="QQ" prop="storeAccountId">
                <el-input v-model="form.qq" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="订单抽成比例" prop="storeAccountId">
                <el-input v-model="form.orderProportion" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="提现银行" prop="storeAccountId">
                <el-input v-model="form.eextensionBindBank.bindBankName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="提现银行卡账号" prop="storeAccountId">
                <el-input v-model="form.eextensionBindBank.exBingBankCardNumber" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="提现银行卡开户人" prop="storeAccountId">
                <el-input v-model="form.eextensionBindBank.bindName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="是否允许二级分销" prop="storeAccountId">
                <el-radio-group v-model="form.isSecond">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input style="width:400px;" v-model="form.note" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">修改</el-button>

            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
    <!-- 充值信息填写 -->
</template>

<script>
import {
    update
    //getInfoById
} from "@/api/promotor";
export default {
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {};
        const form = {
            exAccount: "",
            qq: "",
            orderProportion: "",
            isSecond: "",
            id: "",
            exAccountName: "",
            eextensionBindBank: {
                id: "",
                exBingBankCardNumber: "",
                bindName: "",
                bindBankName: ""
            },
            note: ""
        };
        return {
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false,
            exAccountName: ""
        };
    },
    created() {
        this.create();
    },
    methods: {
        getInfo() {
            this.loading = true;
            getInfoById({
                id: this.form.id
            })
                .then(r => {
                    if (r.data.bbuyerBindBank) {
                        this.form.bbuyerBindBank.id = r.data.bbuyerBindBank.id;
                        this.form.bbuyerBindBank.bankName =
                            r.data.bbuyerBindBank.bankName;
                        this.form.bbuyerBindBank.bankCardNumber =
                            r.data.bbuyerBindBank.bankCardNumber;
                        this.form.bbuyerBindBank.bankBindName =
                            r.data.bbuyerBindBank.bankBindName;
                    }
                    if (r.data.bbuyerAudit) {
                        this.form.bbuyerAudit.id = r.data.bbuyerAudit.id;
                        this.form.bbuyerAudit.realName =
                            r.data.bbuyerAudit.realName;
                        this.form.bbuyerAudit.bindIdentityCard =
                            r.data.bbuyerAudit.bindIdentityCard;
                    }
                    this.form.promoterId = r.data.promoterId;
                    this.form.qq = r.data.qq;
                })
                .finally(() => (this.loading = false));
        },
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
                    var o = update;

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
.xl-width-150 {
    width: 100px;
}
/deep/.el-input__inner {
    width: 100%;
}
</style>