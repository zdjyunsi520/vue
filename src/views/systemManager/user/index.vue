<template>
    <div class="app-container">

        <el-row :gutter="20" class="comheight dragbox" ref="dragbox">
            <el-col :xs="{span: 24}" class="treebox comheight dragleft">
                <div style="background:#fff;height:100%">
                    <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
                        <el-tree ref="tree" :data="treeData" node-key="id" :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false"></el-tree>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col class="dragresize">
                <span class="iconslider">
                    <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-8px;" />
                    <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
                </span>
            </el-col>
            <el-col :xs="{span: 24}" class="app-container dragright mxright" style="padding-top:0;padding-bottom:0;">
                <div class="search-box xl-querybox">
                    <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
                        <el-form-item label="姓名：" prop="name">
                            <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="用户名：" prop="username">
                            <el-input v-model="queryParams.username" placeholder="请输入用户名" clearable @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item label="手机号：" prop="mobilephone">
                            <el-input v-model="queryParams.mobilephone" placeholder="请输入手机号" clearable @keyup.enter.native="handleQuery" />
                        </el-form-item>
                        <el-form-item>
                            <el-button icon="el-icon-search" type="primary" @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="containerbox" ref="containerbox" style="background:#fff">
                    <el-row class="table-btns">
                        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
                        <el-dropdown @command="handleCommand">
                            <el-button type="primary" plain :disabled="multiple">
                                <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>岗位状态<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="1">在职</el-dropdown-item>
                                <el-dropdown-item command="3">离职</el-dropdown-item>
                                <el-dropdown-item command="2">休假</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-row>
                    <el-table v-loading="listLoading" :data="dataList" border :height="tableHeight" @selection-change="handleSelectionChange">

                        <template slot="empty">
                            <div class="nodata-box">
                                <img src="../../../assets/image/nodata.png" />
                                <p>暂时还没有数据</p>
                            </div>
                        </template>
                        <el-table-column type="selection" width="55" fixed="left" />
                        <el-table-column label="姓名" min-width="150" prop="Name" />
                        <el-table-column label="预留手机号" width="150" prop="MobilePhone" />
                        <el-table-column label="用户名" min-width="150" prop="UserName" />
                        <el-table-column label="添加时间" sortable width="200" prop="CreateTime">
                            <template slot-scope="{row}">
                                <i class="el-icon-time" style="margin-right:10px" />{{row.CreateTime}}
                            </template>
                        </el-table-column>
                        <el-table-column label="岗位状态" sortable width="120" prop="Status" :formatter="filterStatus" />
                        <el-table-column label="账号" width="90" prop="IsOpenAccount" :formatter="filterAccount" />
                        <el-table-column label="操作" fixed="right" width="300">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" @click="handleUpdate(scope.row)">
                                    <svg-icon icon-class='ic_edit' class="tablesvgicon"></svg-icon>编辑
                                </el-button>
                                <el-button size="mini" type="text" @click="handlePassword(scope.row,true)" v-if="scope.row.IsOpenAccount">
                                    <svg-icon icon-class='ic_password' class="tablesvgicon"></svg-icon>编辑密码
                                </el-button>
                                <el-button size="mini" type="text" @click="handlePassword(scope.row,false)" v-else>
                                    <svg-icon icon-class='ic_opening' class="tablesvgicon" />开通账号</el-button>
                                <el-button size="mini" v-if="scope.row.IsOpenAccount" type="text" @click="handleUpdateRole(scope.row)">
                                    <svg-icon icon-class='ic_jurisdiction' class="tablesvgicon"></svg-icon>设置权限
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script>
import { fetchList, getInfo, deleted, setSts } from "@/api/systemManager/user";
import { fetchTree } from "@/api/systemManager/organization";

export default {
    name: "components",
    data() {
        return {
            // 遮罩层
            loading: true,
            dataList: [],
            // 总条数
            total: 0,
            // 搜索参数
            queryParams: {
                pageno: 1,
                pagesize: 30,
                mobilephone: "",
                username: "",
                name: "",
                tenantId: "",
                text: ""
            },
            defaultProps: {
                children: "childs",
                label: "text"
            },
            addClass: true,
            addId: "",
            operateId: "",
            data: {},
            treeData: [],
            listLoading: true,
            tableHeight: "calc(100% - 125px)",
            rules: {},
            multiple: true,
            checkedNode: null
        };
    },
    created() {
        const { data } = this.$route.params;
        this.checkedNode = data || null;
        this.getTree();
    },
    mounted() {
        this.dragControllerDiv();
    },
    methods: {
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection;
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        filterStatus(row) {
            return row.Status == 1
                ? "在职"
                : row.Status == 2
                ? "休假"
                : row.Status == 3
                ? "离职"
                : row.Status == 99
                ? "删除"
                : "";
        },
        filterAccount(row) {
            return row.IsOpenAccount ? "已开通" : "未开通";
        },
        handleCommand(commond) {
            const ids = this.ids.map(v => v.Id);
            const status = commond;
            setSts({ ids, status }).then(r => {
                this.$message.success("状态已更新！");
                this.getList();
            });
        },
        getTree() {
            fetchTree({}).then(r => {
                this.treeData = r.data;
                if (r.data.length) {
                    let checkedNode = this.checkedNode
                        ? this.checkedNode
                        : r.data[0];
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(checkedNode.id);
                    });
                    this.handleNodeClick(checkedNode);
                }
            });
        },
        /** 搜索菜单列表 */
        getList() {
            this.loading = true;
            this.listLoading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.dataList = response.data.map(v => {
                        // v.children = v.childs;
                        v.lvl = true;
                        return v;
                    });
                    this.dataList = response.data;
                    this.loading = false;
                    this.listLoading = false;
                    this.total = response.total;
                })
                .finally(v => {
                    this.listLoading = false;
                    this.loading = false;
                });
        },
        handleNodeClick(data) {
            this.queryParams.tenantId = data.id;
            this.queryParams.text = data.text;
            this.getList();
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageno = 1;
            this.getList();
        },
        /** 新增按钮操作 */
        handleAdd() {
            const tenantId = this.queryParams.tenantId;
            if (!tenantId) {
                this.$message.error("请先选择一个单位");
                return;
            }
            const text = this.queryParams.text;
            const title = "添加人员信息";
            const data = { tenantId, text };
            this.$router.push({
                name: "/systemManager/user/components/add",
                params: { data, title }
            });
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        /** 编辑按钮操作 */
        handleUpdate(data) {
            let mobilephone, id, name;
            name = data.Name;
            mobilephone = data.MobilePhone;
            id = data.Id;
            const tenantId = this.queryParams.tenantId;
            const text = this.queryParams.text;
            data = { id, name, mobilephone, tenantId, text };
            const title = "编辑人员信息";
            this.$router.push({
                name: "/systemManager/user/components/add",
                params: { data, title }
            });
        },
        handlePassword(data, first) {
            let id = data.Id;
            const oldpassword = first ? "" : "123";
            const tenantId = this.queryParams.tenantId;
            const text = this.queryParams.text;
            const title = "编辑密码";
            data = { id, first, oldpassword, tenantId, text };
            this.$router.push({
                name: "/systemManager/user/components/password",
                params: { data, title }
            });
        },

        handleUpdateRole(row) {
            const id = row.Id;
            const tenantId = this.queryParams.tenantId;
            const text = this.queryParams.text;
            const data = {
                id,
                fromUrl: "/systemManager/user/index",
                tenantId,
                text
            };
            const title = "编辑权限";
            this.$router.push({
                name: "/commonManager/user/components/role",
                params: { data, title }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm("是否确认删除选中的数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(v => {
                const id = this.operateId;
                deleted({ id }).then(r => {
                    this.$message.success("删除成功！");
                    this.getList();
                });
            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/tree.scss";
.xl-left {
    width: 300px;
    float: left;
}
.xl-right {
    width: 100%;
    margin-left: 300px;
}
.infobox {
    line-height: 1.5;
    padding: 15px 20px;
    p {
        text-align: left;
        font-size: 14px;
        color: #333;
    }
}
</style>
<style lang="scss">
// .xl-query {
//   /deep/.el-form-item {
//     margin-bottom: 0;
//   }
//   /deep/ .el-input__inner {
//     width: 140px;
//   }
//   /deep/.el-date-editor.el-input {
//     width: 200px;

//     .el-input__inner {
//       width: 200px;
//     }
//   }
// }
</style>
