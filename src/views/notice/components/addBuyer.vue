<template>
    <!-- 充值信息填写 -->
    <el-dialog width="800px" :title="title+'公告'" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center :destroy-on-close="true">
        <el-form ref="form" :model="form" :rules="rules">

            <el-form-item label="公告标题" prop="title">
                <el-input v-model="form.title" autocomplete="off" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker :editable="false" v-model="form.startTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker :editable="false" v-model="form.endTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否弹窗">
                <el-checkbox v-model="form.type" :true-label="2" :false-label="1">弹窗</el-checkbox>
            </el-form-item>
            <el-form-item label="是否置顶">

                <el-checkbox v-model="form.isIndex" :true-label="1" :false-label="0">置顶</el-checkbox>
            </el-form-item>
            <el-form-item label="公告内容" prop="content">
                <editor @input="handleContent" ref="editors" :value="content"></editor>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button :loading="loading" type="warning" @click="handleSubmit">{{title}}</el-button>

            <el-button @click="handleOpen">取消</el-button>
        </div>
    </el-dialog>
    <!-- 充值信息填写 -->
</template>

<script>
import { add, update } from "@/api/notice/buyer";
import { dateFortmat } from "@/utils";
import Editor from "@/components/Editor";

export default {
    components: {
        Editor
    },
    data() {
        const form = {
            title: "",
            startTime: "",
            endTime: "",
            isIndex: 0,
            type: 1,
            content: "",
            status: 1,
            id: ""
        };
        const rules = {
            title: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            startTime: [
                { required: true, trigger: "blur", message: "此处不能为空" }
            ],
            endTime: [
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
    computed: {
        title() {
            return this.form.id ? "修改" : "添加";
        }
    },
    methods: {
        filterTime() {
            if (
                this.form.startTime &&
                this.form.endTime &&
                this.form.startTime > this.form.endTime
            ) {
                const a = this.form.startTime;
                this.form.startTime = this.form.endTime;
                this.form.endTime = a;
            }
            if (this.form.startTime && this.form.startTime.length != 19) {
                this.form.startTime = dateFortmat(
                    this.form.startTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (this.form.endTime && this.form.endTime.length != 19) {
                this.form.endTime = dateFortmat(
                    this.form.endTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
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
        handleOpen() {
            this.dialogVisible = !this.dialogVisible;
            if (!this.dialogVisible) {
                this.loading = false;
                this.create();
            }
        },
        handleSubmit() {
            this.loading = true;

            this.$refs.form.validate(v => {
                if (v) {
                    this.filterTime();

                    var o;
                    if (this.form.id) {
                        o = update;
                    } else {
                        o = add;
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




