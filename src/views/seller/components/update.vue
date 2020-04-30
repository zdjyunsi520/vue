<template>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" :title="'修改商家信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="手机号">
                {{form.merAccount}}
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
                <el-input v-model="form.password" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="确认用户密码" prop="tbAccount">
                <el-input v-model="form.password1" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="提现密码" prop="form.mbindBank.bankBindPwd">
                <el-input v-model="form.mbindBank.bankBindPwd" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="确认提现密码" prop="bankBindPwd1">
                <el-input v-model="form.mbindBank.bankBindPwd1" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="QQ" prop="qq">
                <el-input v-model="form.qq" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="银行名称" prop="bankName">
                <el-input v-model="form.mbindBank.bankName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankCardNumber">
                <el-input v-model="form.mbindBank.bankCardNumber" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="开户人" prop="bankAccountName">
                <el-input v-model="form.mbindBank.bankAccountName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="可绑店铺上限" prop="maximumNumberOfStores">
                <el-input v-model="form.maximumNumberOfStores" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="派单机制" prop="sex">
                <el-radio-group v-model="form.limitMerIdOrStoreId">
                    <el-radio :label="0">商家ID</el-radio>
                    <el-radio :label="1">店铺ID</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="买手多少天可再接" prop="limitedTime">
        <el-input v-model="form.mlimitPublishTask.limitedTime" autocomplete="off" placeholder=""></el-input>
      </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">修改</el-button>

            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
    <!-- 充值信息填写 -->
</template>

<script>
import area from "@/utils/area_data1";
import { getInfoById, update } from "@/api/seller";
import { validMoney } from "@/utils/validate";

const levelList = [
    { id: 0, title: "未设定" },
    { id: 1, title: "3心" },
    { id: 2, title: "4心" },
    { id: 3, title: "5心" },
    { id: 4, title: "1钻" },
    { id: 5, title: "2钻" },
    { id: 6, title: "3钻以上" }
];

export default {
    data() {
        const form = {
            mbindBank: {
                id: "",
                bankAccountName: "",
                bankBindPwd: "",
                bankCardNumber: "",
                bankName: ""
            },
            // mlimitPublishTask: {
            //   id: '',
            //   limitedTime: ''
            // },
            exId: "",
            id: "",
            password: "",
            password1: "",
            limitMerIdOrStoreId: 0,
            maximumNumberOfStores: "",
            merAccount: "",
            qq: ""
        };
        const rules = {};
        return {
            form,
            form1: form,
            rules,
            levelList,
            dialogVisible: false,
            loading: false,
            bankList: [],
            areaData: {},
            bindAccountId: 0
        };
    },
    created() {
        const all = JSON.parse(area);
        this.areaData.all = all;
        this.areaData.province = all.filter(v => v.l == 1);
        this.areaData.city = all.filter(v => v.l == 2);
        this.areaData.region = all.filter(v => v.l == 3);
    },
    methods: {
        getInfo() {
            this.loading = true;
            getInfoById({
                id: this.form.id
            })
                .then(r => {
                    if (r.data.mbindBank) {
                        this.form.mbindBank.id = r.data.mbindBank.id;
                        this.form.mbindBank.bankAccountName =
                            r.data.mbindBank.bankAccountName;
                        this.form.mbindBank.bankCardNumber =
                            r.data.mbindBank.bankCardNumber;
                        this.form.mbindBank.bankName =
                            r.data.mbindBank.bankName;
                    }
                    // if (r.data.mlimitPublishTask) {
                    //   this.form.mlimitPublishTask.id = r.data.mlimitPublishTask.id;
                    //   this.form.mlimitPublishTask.limitedTime =
                    //     r.data.mlimitPublishTask.limitedTime;
                    // }
                    this.form.exId = r.data.exId;
                    this.form.limitMerIdOrStoreId = r.data.limitMerIdOrStoreId;
                    this.form.maximumNumberOfStores =
                        r.data.maximumNumberOfStores;
                    this.form.merAccount = r.data.merAccount;
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
        valid() {
            if (this.form.password != "") {
                if (this.form.password1 != this.form.password) {
                    return "两次密码不一致";
                }
            }
            if (this.mbindBank.bankBindPwd != "") {
                if (this.mbindBank.bankBindPwd != this.mbindBank.bankBindPwd1) {
                    return "两次密码不一致";
                }
            }
            if (
                this.mbindBank.bankAccountName != "" ||
                this.mbindBank.bankAccountName != "" ||
                this.mbindBank.bankAccountName != ""
            ) {
            }
        },
        handleSubmit() {
            this.$refs.form.validate(v => {
                if (v) {
                    this.loading = true;
                    var o;
                    o = update;
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
    computed: {
        dataCity() {
            const city = this.areaData.city.filter(
                v => v.p == this.form.province
            );
            this.form.city = city.length > 0 ? city[0].c : "";
            return city;
        },
        dataRegion() {
            const region = this.areaData.region.filter(
                v => v.p == this.form.city
            );
            this.form.district = region.length > 0 ? region[0].c : "";
            return region;
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