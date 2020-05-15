<template>
    <div class="app-container">
        <el-row :gutter="20" class="xl-query">

            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query">
                    <!-- <el-form-item prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="用户名称" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item> -->
                    <el-form-item prop="phone">
                        <el-input v-model="queryParams.phone" placeholder="手机号码" clearable size="small" @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <!-- <el-form-item prop="status">
                        <el-select v-model="queryParams.status" clearable size="small">
                            <el-option label="用户状态" value=""></el-option>
                            <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item prop="status">
                        <el-select v-model="queryParams.deptId" clearable size="small">
                            <el-option label="所属站点" value="" />
                            <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
                        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
                        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
                        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>
                    </el-form-item>
                </el-form>

                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" />
                    <el-table-column label="用户编号" align="center" prop="userId" />
                    <el-table-column label="用户名称" align="center" prop="userName" />
                    <el-table-column label="用户昵称" align="center" prop="nickName" />
                    <el-table-column label="分站" align="center" prop="dept.deptName" />
                    <el-table-column label="手机号码" align="center" prop="phone" />
                    <!-- <el-table-column label="状态" align="center">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="handleStatusChange(scope.row)"></el-switch>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="创建时间" align="center" prop="createTime">
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改资料</el-button>
                            <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">重置密码</el-button>
                            <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>
          <update ref="update" @getList="getList"></update>
    </div>
</template>

<script>
import {
    listUser,
    getUser,
    delUser,
    addUser,
    updateUser,
    exportUser,
    resetUserPwd,
    changeUserStatus,
    updateUserRoles,
    getUserRoles
} from "@/api/system/user";
import { treeselect } from "@/api/system/dept";
import { listPost } from "@/api/system/post";
import { listRole } from "@/api/system/role";
import Treeselect from "@riophae/vue-treeselect";
import { fetchDept } from "@/api/common";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import update from "./components/update";
export default {
    name: "",
    components: { Treeselect,update },
    data() {
        return {
            deptType: null,
            // 遮罩层
            loading: true,
            roleLoading: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 分站树选项
            deptOptions: undefined,
            // 是否显示弹出层
            open: false,
            open1: false,
            // 分站名称
            deptName: undefined,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 状态数据字典
            statusOptions: [],
            // 性别状态字典
            sexOptions: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
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
            },
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
        this.fetchDept();
        this.getRoles();
        //this.getTreeselect();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
        this.getDicts("sys_user_sex").then(response => {
            this.sexOptions = response.data;
        });
        this.getConfigKey("sys.user.initPassword").then(response => {
            this.initPassword = response.data;
        });
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
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
                response => {
                    this.userList = response.data.list;
                    this.total = response.data.total;
                }
            ).finally(r=>{
                this.loading = false;
            });
        },
        /** 查询分站下拉树结构 */
        getTreeselect() {
            treeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.getList();
        },
        /** 查询岗位列表 */
        getPosts() {
            listPost().then(response => {
                this.postOptions = response.rows;
            });
        },
        /** 查询角色列表 */
        getRoles() {
            listRole().then(response => {
                this.roleOptions = response.data.filter(v => v.status == 0);
            });
        },

        // 取消按钮
        cancel() {
            this.open = false;
        },
        // 取消按钮
        cancel1() {
            this.open1 = false;
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.page = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
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
            const target = this.$refs.update
            target.handleOpen();
            target.title = "添加用户";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const target =   this.$refs.update
            target.handleOpen(row);
            target.title = "修改用户";
        },
        /** 修改角色按钮操作 */
        handleUpdate1(row) {
            this.reset(row);
            this.open1 = true;
            this.roleLoading = true;
            getUserRoles(row)
                .then(r => {
                    this.form.roleIds = r.data;
                })
                .finally(r => {
                    this.roleLoading = false;
                });
        },
        /** 重置密码按钮操作 */
        handleResetPwd(row) {
            this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            })
                .then(({ value }) => {
                    resetUserPwd(row.userId, value).then(response => {
                        this.msgSuccess(response.msg);
                    });
                })
                .catch(() => {});
        },
        
        submitForm1: function() {
            updateUserRoles(this.form).then(response => {
                this.msgSuccess(response.msg);
                this.open1 = false;
            });
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
// .xl-query {
//     /deep/.el-form-item {
//         margin-bottom: 0;
//     }
//     /deep/ .el-input__inner {
//         width: 130px;
//     }
//     /deep/.el-date-editor.el-input {
//         width: 200px;

//         .el-input__inner {
//             width: 200px;
//         }
//     }
// }
</style>
