<template>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" title="禁止买手接单" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="手机号码">
                {{buyerAccount}}
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="form.forbiddenType">
                    <el-radio :label="1">仅买手</el-radio>
                    <el-radio :label="2">该买手及其直接下属</el-radio>
                    <el-radio :label="3">买手一条线</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="note">
                <el-input v-model="form.note" autocomplete="off" placeholder="" :rows="5" type="textarea"></el-input>
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
import { mapGetters } from "vuex";
import { orderForbid } from "@/api/buyer/info";
export default {
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            note: [emptyRule]
        };
        const form = {
            buyerId: "",
            forbiddenType: 1,
            note: ""
        };
        return {
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false,
            buyerAccount: ""
        };
    },
    methods: {
        show() {
            this.dialogVisible = !this.dialogVisible;
        },
        handleOpen() {
            this.dialogVisible = !this.dialogVisible;
            if (this.dialogVisible) {
                this.loading = false;
                this.form = Object.assign({}, this.form1);
            }
        },
        handleSubmit() {
            this.$refs.form.validate(v => {
                if (v) {
                    this.loading = true;
                    var o = orderForbid;

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
</style>