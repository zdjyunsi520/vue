<template>
    <div class="app-container">
        <el-row :gutter="20" class="xl-query">

            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query">
                    <el-form-item prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="用户名" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="姓名" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item prop="phone">
                        <el-input v-model="queryParams.phone" placeholder="预留手机号" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>

                        <!-- <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"">修改</el-button>
                        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"">导出</el-button> -->
                    </el-form-item>
                </el-form>
                <el-row>
                    <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
                    <el-button type="danger" icon="el-icon-lock" size="mini" @click="handleAdd" :disabled="multiple">一键同步</el-button>
                    <el-button type="success" icon="el-icon-unlock" size="mini" @click="handleAdd" :disabled="multiple">取消同步</el-button>
                </el-row>
                <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border>
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="设备编码" align="center" prop="userName" />
                    <el-table-column label="设备检验码" align="center" prop="nickName" />
                    <el-table-column label="设备类型" align="center" prop="phone" />

                    <el-table-column label="添加人员" align="center" prop="createTime" />
                    <el-table-column label="添加时间" align="center" prop="createTime" />
                    <el-table-column label="同步平台" align="center" prop="createTime" />
                    <el-table-column label="同步结果" align="center" prop="createTime" />
                    <el-table-column label="备注" align="center" prop="createTime" />

                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>
        <add ref="add" @getList="getList"></add>
    </div>
</template>

<script>
import { listUser as fetchList } from "@/api/system/user";

import add from "./components/add";

export default {
    name: "运营用户管理",
    components: { add },
    data() {
        return {
            deptType: null,
            // 遮罩层
            listLoading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 用户表格数据
            dataList: null,

            // 表单参数
            form: {
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
            defaultProps: {
                children: "children",
                label: "label"
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                phone: undefined,
                status: undefined,
                deptId: undefined
            }
        };
    },
    watch: {
        // 根据名称筛选分站树
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.listLoading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.dataList = response.data.list;
                    this.total = response.data.total;
                })
                .finally(r => {
                    this.listLoading = false;
                });
        },
        /** 查询角色列表 */
        getRoles() {
            listRole().then(response => {
                this.roleOptions = response.data.filter(v => v.status == 0);
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            const target = this.$refs.add;
            target.handleOpen();
            target.title = "添加";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const target = this.$refs.update;
            target.handleOpen(row);
            target.title = "修改信息";
        },
        /** 重置密码按钮操作 */
        handleResetPwd(row) {
            const target = this.$refs.password;
            target.handleOpen(row);
            target.title = "修改密码";
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const userIds = row.userId || this.ids;
            this.$confirm(
                '是否确认删除用户编号为"' + userIds + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return delUser(userIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {
                    this.msgSuccess("操作失败");
                });
        },
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有用户数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return exportUser(queryParams);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        }
    }
};
</script>
<style lang="scss">
.xl-query {
    /deep/.el-form-item {
        margin-bottom: 0;
    }
    /deep/ .el-input__inner {
        width: 130px;
    }
    /deep/.el-date-editor.el-input {
        width: 200px;

        .el-input__inner {
            width: 200px;
        }
    }
}
</style>
