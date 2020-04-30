<template>
    <el-dialog width="800px" title="添加黑名单" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">

            <el-form-item label="拉黑类型">
                <el-radio-group v-model="form.type">
                    <el-radio :label="item.key" v-for="item in idCardList">{{item.value}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="类型对应值" prop="typeName">
                <el-input v-model="form.typeName" autocomplete="off" placeholder=""></el-input>
            </el-form-item>

            <el-form-item label="平台类型" v-show="form.type==4">
                <el-radio-group v-model="form.blackAccountPlatform">
                    <el-radio :label="item.key" v-for="item in platformType">{{item.value}}</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="备注" prop="note">
                <el-input v-model="form.note" autocomplete="off" placeholder=""></el-input>
            </el-form-item>

            <el-form-item>
                <el-button class="xl-form-item-button" :loading="loading" type="warning" @click="handleSubmit">添加</el-button>
                <el-button type="primary" @click="handleOpen">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

</template>

<script>
import { mapGetters } from "vuex";
import { add } from "@/api/buyer/black";
const sourceList = [
    { key: 1, value: "平台添加" },
    { key: 2, value: "导入" }
];
const idCardList = [
    { key: 1, value: "账号" },
    { key: 2, value: "身份证号" },
    { key: 3, value: "银行卡号" },
    { key: 4, value: "平台用户名" },
    { key: 5, value: "QQ" }
];

export default {
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            typeName: [emptyRule],
            password1: [emptyRule],
            phone: [emptyRule],
            qq: [emptyRule],
            recommendCode: [emptyRule]
            //   note: [emptyRule]
        };
        const form = {
            blackAccountPlatform: "",
            buyerAccount: "",
            buyerId: "",
            note: "",
            source: 1,
            type: 1,
            typeName: ""
        };
        return {
            form,
            form1: form,
            rules,
            loading: false,
            idCardList,
            dialogVisible: false
        };
    },
    created() {
        this.create();
    },
    computed: {
        ...mapGetters({ platformType: "status/platformType" })
    },
    methods: {
        create() {
            this.form = Object.assign({}, this.form1);
        },
        handleOpen() {
            this.loading = false;
            this.dialogVisible = false;
            this.create();
        },
        handleSubmit() {
            this.$refs.form.validate(v => {
                if (v) {
                    if (this.form.type == 4) {
                        if (this.form.blackAccountPlatform == "") {
                            this.$message.error("请选择平台类型");
                            return;
                        }
                    } else {
                        this.form.buyerId = "";
                        this.form.buyerAccount = "";
                        this.form.blackAccountPlatform = "";
                    }
                    var o = add;
                    this.loading = true;
                    o(this.form)
                        .then(res => {
                            this.$message.success(res.msg);
                            this.handleOpen();
                            this.$emit("getList");
                        })
                        .catch(e => {
                            this.loading = false;
                        });
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
    margin-left: 240px;
}
/deep/.el-form-item__label {
    width: 120px;
    font-weight: normal;
}
/deep/.el-input,
/deep/.el-select {
    width: 470px;
    .el-input {
        width: 100%;
    }
}
/deep/.el-form-item__error {
    left: 195px;
}
.xl-width-150 {
    width: 100px;
}
/deep/.el-input__inner {
    width: 100%;
}
.xl-tabs {
    margin: 20px;
}
</style>