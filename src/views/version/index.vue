<template>
    <!-- 充值信息填写 -->
    <el-row class="xl-margin-top">
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="下载链接" prop="download">
                <el-input v-model="form.download" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="热更新链接" prop="hotUrl">
                <el-input v-model="form.hotUrl" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="上传apk">
                <el-upload action="#" class="upload-demo" :accept="accept" :auto-upload="true" :http-request="uploadOSSIMG" :show-file-list="false">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <el-progress class="uploadProcess" :width="55" type="circle" :percentage="percent" :status="status" v-if="percent>0"></el-progress>
            </el-form-item>
            <!-- <el-form-item label="版本号" prop="version">
                <el-input v-model="form.version" autocomplete="off" placeholder=""></el-input>
            </el-form-item> -->
            <el-form-item label="版本号" prop="number">
                <el-input v-model="form.number" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="版本内容" prop="content">
                <editor class="xl-height" @input="handleContent" ref="editors" :value="content"></editor>
            </el-form-item>
        </el-form>
        <el-button class="dialog-footer" :loading="loading" type="warning" @click="handleSubmit">保存</el-button>
    </el-row>
    <!-- 充值信息填写 -->
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { update, fetchList } from "@/api/version";
import Editor from "@/components/Editor";

export default {
    components: {
        Editor
    },
    data() {
        const form = {
            download: "",
            version: "",
            content: "",
            number: "",
            hotUrl: ""
        };
        const rules = {
            download: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            number: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            content: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            hotUrl: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ]
        };
        return {
            form,
            form1: form,
            rules,
            loading: false,
            content: "",
            accept: "",
            percent: 0,
            status: undefined
        };
    },
    created() {
        this.getList();
    },
    methods: {
        ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
        uploadOSSIMG(params) {
            const file = params.file;
            const accept = this.accept;
            const fileNameStr = "testtest.apk";
            const processCallBack = this.processCallBack;
            this.ossUpload({ file, accept, fileNameStr, processCallBack })
                .then(r => {
                    this.status = "success";
                })
                .catch(e => {
                    this.status = "exception";
                });
        },
        processCallBack(p) {
            this.percent = parseFloat((p * 100).toFixed(2));
        },

        getList() {
            fetchList().then(r => {
                Object.assign(this.form, r.data);
                this.content = r.data.content;
            });
        },
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
        handleSubmit() {
            this.$refs.form.validate(v => {
                if (v) {
                    this.loading = true;

                    var o = update;

                    o(this.form)
                        .then(res => {
                            this.$message.success(res.msg);
                        })
                        .finally(e => {
                            this.loading = false;
                        });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.uploadProcess {
    position: absolute;
    top: -10px;
    left: 200px;
}
/deep/.upload-demo {
    .el-upload {
        display: block;
        float: left;
    }
}
/deep/.el-form-item__label {
    width: 100px;
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
    margin-left: 100px;
}
.xl-margin-top {
    margin-top: 20px;
}
.xl-height {
    display: inline-block;
    width: 45%;
    height: 400px;
}
/deep/.editor {
    height: 100%;
    //margin:0 20px;
}
</style>




