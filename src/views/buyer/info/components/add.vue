<template>
    <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="注意事项">
            必须严格按照模板输入手机号码和QQ，手机号已存在或者手机格式错误，QQ为空将不会注册,注册前请仔细查看
        </el-form-item>

        <el-form-item label="邀请码" prop="recommendCode">
            <el-input v-model="form.recommendCode" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item>
            <el-row class="xl-form-item-button">
                <el-button :loading="loading" type="primary" @click="handleExport">导出模板</el-button>
                <!-- <el-upload
          :on-success="handleSuccess"
          class="upload-demo"
          :action="action"
          :headers="headers"
          :show-file-list="false"
        >
          <el-button
            :loading="loading"
            type="warning"
            v-hasPermi="['system:member:addMerchant:upload']"
            >导入手机号和QQ</el-button
          >
        </el-upload> -->
                <el-upload class="upload-demo" :accept="accept" :action="action" :show-file-list="false" :http-request="(file)=>uploadOSSIMG.call(this,file)">
                    <el-button :loading="loading" type="warning" v-hasPermi="['system:member:addMerchant:upload']">导入手机号和QQ</el-button>
                </el-upload>

                <el-button :loading="loading" type="success" @click="handleSubmit" v-hasPermi="['system:member:addMerchant:batchBuyer']">批量添加</el-button>
            </el-row>
        </el-form-item>
    </el-form>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { addMutiple as add, exportTemp as exportExcel } from "@/api/buyer/info";
import { getToken } from "@/utils/auth";
export default {
    data() {
        const emptyRule = {
            required: true,
            trigger: "blur",
            message: "此处不能为空"
        };
        const rules = {
            recommendCode: [emptyRule]
        };
        const form = {
            path: "",
            recommendCode: ""
        };
        return {
            form,
            form1: form,
            rules,
            loading: false,
            action: "",
            headers: {},
            accept: ".xls,.xlsx"
        };
    },
    computed: {
        ...mapGetters({ path: "imgOSS/path" })
    },
    created() {
        this.create();
        this.action =
            process.env.VUE_APP_BASE_API + "/system/member/addMerchant/upload";
        this.headers = { Authorization: "Bearer " + getToken() };
    },
    methods: {
        ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
        create() {
            this.form = Object.assign({}, this.form1);
        },
        handleOpen() {
            this.loading = false;
            this.create();
        },
        handleSuccess(r) {
            if (r.code) {
                this.$message.error(r.msg);
            } else {
                this.$message.success(r.msg);
                this.form.path = r.data;
            }
        },
        uploadOSSIMG(params) {
            this.loading = true;
            const file = params.file;
            const accept = this.accept;
            this.ossUpload({ file, accept })
                .then(r => {
                    this.$message.success("上传成功");
                    this.form.path = this.path + r;
                })
                .catch(e => {
                    this.$message.error("文件上传失败请重新上传");
                })
                .finally(() => (this.loading = false));
        },
        handleSubmit() {
            this.$refs.form.validate(v => {
                if (v) {
                    if (!this.form.path) {
                        this.$message.error("请先导入excel");
                        return;
                    }
                    var o = add;
                    o(this.form).then(res => {
                        this.$message.success(res.msg);
                    });
                    this.handleOpen();
                    this.$message("提交成功，后台处理中，请过一会儿再回来看看");
                }
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            location.href = this.path + "batchRegisterBuyerTemplate.xlsx";
            return;
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data, 1);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.xl-form-item-button {
    margin-left: 120px;
}

.upload-demo {
    display: inline-block;
}
</style>
