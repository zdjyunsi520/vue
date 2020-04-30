<template>
    <!-- 添加或修改分站对话框 -->
    <el-dialog top="50px" :title="title" :visible.sync="open" width="700px" center :close-on-click-modal="false">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="分站名称" prop="deptName">
                        <el-input v-model="form.deptName" placeholder="请输入分站名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="显示排序" prop="orderNum">
                        <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="后台域名" prop="backSideServerName">
                        <el-input v-model="form.backSideServerName" placeholder="请输入后台域名" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="商家域名" prop="merSideServerName">
                        <el-input v-model="form.merSideServerName" placeholder="请输入商家端域名" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="推广域名" prop="exSideServerName">
                        <el-input v-model="form.exSideServerName" placeholder="请输入推广端域名" />
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="联系电话" prop="phone">
                        <el-input v-model="form.phone" placeholder="请输入联系电话" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="分站标识" prop="deptIdentification">
                        <el-input v-model="form.deptIdentification" placeholder="请输入分站标识" />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="短信模板标题" prop="labelName">
                        <el-input v-model="form.labelName" placeholder="请输入短信模板标题" />
                    </el-form-item>
                </el-col>

                <el-col>
                    <el-form-item prop="status" label="选择角色">
                        <el-select v-model="form.roleId" clearable size="small">
                            <el-option label="选择角色" value="" />
                            <el-option :key="item.roleId" :label="item.roleName" :value="item.roleId" v-for="item in roleOptions" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="分站logo" prop="indexLogo">
                        <el-upload :accept="accept" :auto-upload="true" class="avatar-uploader" action="#" :show-file-list="false" :http-request="file => uploadOSSIMG.call(this, file)">
                            <img v-show="show" :src="path + form.deptLogo" class="avatar" />
                            <i v-show="!show" class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-tag>尺寸200x50</el-tag>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addDept, updateDept } from "@/api/system/dept";
import { listRole } from "@/api/system/role";
import { mapGetters, mapActions, mapState } from "vuex";
export default {
    data() {
        return {
            roleOptions: [],
            accept: ".jpg,.png,.jpeg",
            show: false,
            goodsImgUrl: "",
            title: "",
            open: false,
            form: {},
            // 表单校验
            rules: {
                roleId: [
                    {
                        required: true,
                        message: "请选择分站角色",
                        trigger: "blur"
                    }
                ],
                deptName: [
                    {
                        required: true,
                        message: "分站名称不能为空",
                        trigger: "blur"
                    }
                ],
                orderNum: [
                    {
                        required: true,
                        message: "菜单顺序不能为空",
                        trigger: "blur"
                    }
                ],
                deptLeader: [
                    {
                        required: true,
                        message: "分站拥有者不能为空",
                        trigger: "blur"
                    }
                ],
                backSideServerName: [
                    {
                        required: true,
                        message: "后台域名不能为空",
                        trigger: "blur"
                    }
                ],
                exSideServerName: [
                    {
                        required: true,
                        message: "推广域名不能为空",
                        trigger: "blur"
                    }
                ],
                merSideServerName: [
                    {
                        required: true,
                        message: "商家域名不能为空",
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    computed: {
        ...mapGetters({ path: "imgOSS/path" }),
        ...mapState(["status"])
    },
    created() {
        this.getRoles();
    },
    methods: {
        ...mapActions({ ossUpload: "imgOSS/ossUpload" }),
        getRoles() {
            listRole().then(response => {
                this.roleOptions = response.data.filter(v => v.status == 0);
            });
        },
        // 表单重置
        reset() {
            this.form = {
                deptId: "",
                deptName: "",
                orderNum: 1,
                backSideServerName: "",
                merSideServerName: "",
                exSideServerName: "",
                phone: "",
                deptIdentification: "",
                deptLogo: "",
                roleId: "",
                labelName: ""
            };
            this.resetForm("form");
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.deptId != "") {
                        updateDept(this.form).then(response => {
                            this.status.deptType = null;
                            this.status.deptKV = null;
                            this.msgSuccess("修改成功");
                            this.open = false;
                            this.$emit("getList");
                        });
                    } else {
                        addDept(this.form).then(response => {
                            this.status.deptType = null;
                            this.status.deptKV = null;
                            this.msgSuccess("新增成功");
                            this.open = false;
                            this.$emit("getList");
                        });
                    }
                }
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        uploadOSSIMG(params) {
            const file = params.file;
            const accept = this.accept;
            this.ossUpload({ file, accept })
                .then(r => {
                    this.form.deptLogo = r;
                    this.show = true;
                })
                .catch(e => {
                    e = e || "图片上传失败请重新上传";
                    this.$message.error(e);
                });
        }
    }
};
</script>

<style lang="scss" scoped></style>
