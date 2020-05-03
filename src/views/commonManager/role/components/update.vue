<template>
    <el-dialog width="800px" :title="title" :visible.sync="dialogVisible" :modal-append-to-body="false" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" center>
        <!-- 添加或修改参数配置对话框 -->
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
                <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
            </el-form-item>
            <el-form-item label="角色顺序" prop="roleSort">
                <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item label="菜单权限">
                <el-tree :data="menuOptions" show-checkbox ref="menu" node-key="id" empty-text="加载中，请稍后" :props="defaultProps"></el-tree>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleSubmit" :loading="loading">确 定</el-button>
            <el-button @click="handleOpen(null)">取 消</el-button>
        </div>
        <!-- 添加或修改参数配置对话框 end -->
    </el-dialog>
</template>

<script>
import { addRole as add, updateRole as update } from "@/api/system/role";
import {
    treeselect as menuTreeselect,
    roleMenuTreeselect
} from "@/api/system/menu";
export default {
    data() {
        const rules = {
            roleName: [
                {
                    required: true,
                    message: "角色名称不能为空",
                    trigger: "blur"
                }
            ],
            roleKey: [
                {
                    required: true,
                    message: "权限字符不能为空",
                    trigger: "blur"
                }
            ],
            roleSort: [
                {
                    required: true,
                    message: "角色顺序不能为空",
                    trigger: "blur"
                }
            ]
        };
        return {
            form: {},
            rules,
            dialogVisible: false,
            loading: false,
            title: "",
            // 角色选项
            roleOptions: [],
            deptType: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            menuOptions: []
        };
    },
    created() {
        this.getMenuTreeselect();
    },
    methods: {
        fetchData() {},
        /** 查询菜单树结构 */
        getMenuTreeselect() {
            menuTreeselect().then(response => {
                this.menuOptions = response.data;
            });
        },
        // 表单重置
        reset(data) {
            this.form = Object.assign(
                {
                    roleId: undefined,
                    roleName: undefined,
                    roleKey: undefined,
                    roleSort: 0
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
                    this.loading = true;
                    if (this.form.userId != undefined) {
                        //保存修改
                        update(this.form)
                            .then(response => {
                                //消息提示
                                this.$message.success(response.msg);
                                //刷新列表
                                this.$emit("getList");
                                //关闭窗口
                                this.handleOpen();
                            })
                            .catch(r => {
                                //取消按钮转圈圈
                                this.loading = false;
                            });
                    } else {
                        //添加用户
                        add(this.form)
                            .then(response => {
                                //消息提示
                                this.$message.success(response.msg);
                                //刷新列表
                                this.$emit("getList");
                                //关闭窗口
                                this.handleOpen();
                            })
                            .catch(r => {
                                //取消按钮转圈圈
                                this.loading = false;
                            });
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
</style>