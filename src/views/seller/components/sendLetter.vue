<template>
    <!-- 充值信息填写 -->
    <el-dialog top="30px" width="800px" title="发送站内信" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="发送对象">
                {{form.merAccountList.join(',').replace(/,$/,'')}}
            </el-form-item>
            <el-form-item label="站内信标题" prop="title">
                <el-input v-model="form.title" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="站内信内容" prop="content">
                <editor @input="handleContent" ref="editors" :value="content"></editor>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">发送</el-button>
            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
    <!-- 充值信息填写 -->
</template>

<script>
import { sendSellerLetter } from "@/api/seller";
import Editor from "@/components/Editor";
export default {
    components: {
        Editor
    },
    data() {
        const form = {
            title: "",
            content: "",
            merAccountList: []
        };
        const rules = {
            title: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            content: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ]
        };
        return {
            form,
            form1: form,
            rules,
            dialogVisible: false,
            loading: false,
            content: ""
        };
    },

    methods: {
        handleContent(content) {
            this.form.content = content;
        },
        getInfo() {
            this.loading = true;
            getInfoById({
                id: this.form.id
            })
                .then(r => {})
                .finally(() => (this.loading = false));
        },
        create() {
            this.form = Object.assign({}, this.form1);
        },
        handleOpen() {
            this.dialogVisible = !this.dialogVisible;
            if (this.dialogVisible) {
                this.loading = false;
                this.create();
            }
        },
        handleSubmit() {
            this.loading = true;

            this.$refs.form.validate(v => {
                if (v) {
                    var o = sendSellerLetter;
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
.dialog-footer {
    margin-top: 30px;
}
</style>




