<template>
    <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        
        <!-- 添加或修改参数配置对话框 -->
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户昵称" prop="nickName">
                            <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属分站" prop="deptId">
                            <el-select v-model="form.deptId" clearable >
                                <el-option label="所属站点" value="" />
                                <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名称" auto-complete="off" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="!form.userId" label="用户密码" prop="password">
                            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" auto-complete="new-password" />
                        </el-form-item>
                    </el-col>


                    <el-col :span="12" v-if="!form.userId">
                        <el-form-item label="角色">
                            <el-select v-model="form.roleIds" multiple placeholder="请选择">
                                <el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId" :disabled="item.status == 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
                <el-button @click="handleOpen(null)">取 消</el-button>
            </div>
        <!-- 添加或修改参数配置对话框 end -->
    </el-dialog>
</template>

<script>
import {
    addUser,
    updateUser
} from "@/api/system/user";
import { fetchDept } from "@/api/common";
export default {
    data() {
        const rules = {
                userName: [
                    {
                        required: true,
                        message: "用户名称不能为空",
                        trigger: "blur"
                    }
                ],
                nickName: [
                    {
                        required: true,
                        message: "用户昵称不能为空",
                        trigger: "blur"
                    }
                ],
                deptId: [
                    {
                        required: true,
                        message: "归属分站不能为空",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "用户密码不能为空",
                        trigger: "blur"
                    }
                ],
                email: [
                    {
                        type: "email",
                        message: "'请输入正确的邮箱地址",
                        trigger: ["blur", "change"]
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            };
        return {
            form:{},
            rules,
            dialogVisible: false,
            loading: false,
            title:'',
           // 角色选项
            roleOptions: [],
            deptType:'',
        };
    },
    created() {
        this.fetchDept();
    },
    methods: {

       
        fetchDept() {
            fetchDept().then(({ data }) => {
                this.deptType = data;
                this.deptKV = data.reduce((l, v) => {
                    l[v.deptId] = v.deptName;
                    return l;
                }, {});
            });
        },
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    userId: undefined,
                    deptId: "",
                    userName: undefined,
                    nickName: undefined,
                    password: undefined,
                    phonenumber: undefined,
                    email: undefined,
                    sex: "2",
                    status: "0",
                    remark: undefined,
                    postIds: [],
                    roleIds: []
                },
                data
            );
        },
        handleOpen(data) {
            //改变窗口状态
            this.dialogVisible = !this.dialogVisible;
            if (!this.dialogVisible) {
                //关闭窗口时取消按钮转圈圈
                this.loading = false;
            }
            //表单重置
            this.reset(data);
        },
        /** 提交按钮 */
        handleSubmit: function() {

            this.$refs["form"].validate(valid => {
                if (valid) {
                    //按钮转圈圈
                    this.loading = true
                    if (this.form.userId != undefined) {
                        //保存修改
                        updateUser(this.form).then(response => {
                            //消息提示
                            this.msgSuccess(response.msg);
                            //刷新列表
                            this.$emit('getList');
                            //关闭窗口
                            this.handleOpen()
                        }).catch(r=>{
                               //取消按钮转圈圈
                            this.loading = false
                        });
                    } else {
                        //添加用户
                        addUser(this.form).then(response => {
                             //消息提示
                            this.msgSuccess(response.msg);
                             //刷新列表
                            this.$emit('getList');
                            //关闭窗口
                            this.handleOpen()
                        }).catch(r=>{
                             //取消按钮转圈圈
                            this.loading = false
                        });;
                    }
                }
            });
        },
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-select{
    width:100%;
}
</style>