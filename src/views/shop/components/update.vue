<template>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" :title="'修改会员信息'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="店铺平台" prop="taskPlatformId">
                <el-radio-group v-model="form.taskPlatformId">
                    <el-radio v-for="item in platformList" :key="item.key" :label="item.key"><img :src="taskPlatformIMG[item.key]" alt="" /> {{item.value}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="店铺名称" prop="storeName">
                <el-input v-model="form.storeName" autocomplete="off" placeholder></el-input>
            </el-form-item>
            <el-form-item label="旺旺ID" prop="storeAccountId">
                <el-input v-model="form.storeAccountId" autocomplete="off" placeholder></el-input>
            </el-form-item>

            <el-form-item label="店铺网址" prop="storeHomeUrl">
                <el-input v-model="form.storeHomeUrl" autocomplete="off" placeholder></el-input>
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
import tb from "@/images/1.png";
import tmall from "@/images/2.png";
import jd from "@/images/3.png";
import pdd from "@/images/4.png";
const taskPlatformIMG = ["", tb, tmall, jd, pdd];
const platformList = [
    { key: 1, value: "淘宝" },
    { key: 2, value: "天猫" },
    { key: 3, value: "京东" },
    { key: 4, value: "拼多多" }
];
import { update } from "@/api/shop";
export default {
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            storeName: [emptyRule],
            storeHomeUrl: [emptyRule],
            storeAccountId: [emptyRule]
        };
        const form = {
            storeId: "",
            storeName: "",
            storeAccountId: "",
            storeHomeUrl: "",
            taskPlatformId: "",
            taskPlatformName: ""
        };
        return {
            platformList,
            taskPlatformIMG,
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false,
            platform: ""
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
                    this.form.taskPlatformName = this.platformList.filter(
                        v => v.key == this.form.taskPlatformId
                    )[0].value;
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
