<template>
    <div class="app-container">

        <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
            <el-form-item>
                <el-button @click="handleOpen('add')">添加推广员</el-button>

            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.deptId" clearable>
                    <el-option label="全部站点" value="" />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.isSurplus" clearable>
                    <el-option label="账户余额" value="0" />
                    <el-option label="有余额" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="推广员ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.exAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="用户名" v-model="queryParams.exAccountName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button v-hasPermi="['management:Extension:excel']" :loading="loading" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="推广员ID" align="center" prop="id" />

            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="推广员级别" align="center" prop="lev" width="60px" />
            <el-table-column label="上级推广员" align="center" prop="upExId" />
            <el-table-column label="用户名" align="center" width="115px" prop="exAccountName" />
            <el-table-column label="手机号码" align="center" width="115px" prop="exAccount" />
            <el-table-column label="QQ" align="center" prop="qq" width="115px" />
            <el-table-column label="账户余额" align="center" prop="eextensionAccount.exAccountBalance" />
            <el-table-column label="累计赚取" align="center" prop="eextensionAccount.totalEarn" />
            <el-table-column label="二级分销" align="center" prop="isSecond" />
            <el-table-column label="订单分成比例" align="center" prop="orderProportion" />
            <el-table-column label="直属商家放单量" align="center" prop="eextensionAccount.directlyMerOrderTotal" />
            <el-table-column label="直属商家已完结单量" align="center" prop="eextensionAccount.directlyMerOrderFinish" />
            <el-table-column label="下属商家放单量" align="center" prop="eextensionAccount.indirectMerOrderTotal" />
            <el-table-column label="下属商家已完结单量" align="center" prop="eextensionAccount.indirectMerOrderFinish" />
            <el-table-column label="状态" align="center" prop="state" :formatter="filterDisable" />
            <el-table-column label="备注" align="center" prop="note" />
            <el-table-column width="300px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-hasPermi="['system:management:Extension:updateBindInfo']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('update',$index)">修改</el-button>
                    <el-button v-hasPermi="['system:management:Extension:updateState']" v-if="row.state==0" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts',$index,1)">禁用</el-button>
                    <el-button v-hasPermi="['system:management:Extension:updateState']" v-else type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleEnable($index)">启用</el-button>
                    <el-button v-hasPermi="['management:Extension:updatePassword']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts',$index,0)">重置密码</el-button>

                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
        <set-sts ref="setSts" @getList="getList" :reason="reason"></set-sts>
        <add ref="add" @getList="getList"></add>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
import { fetchList, disabled, exportExcel } from "@/api/promotor";
import update from "./components/update";
import setSts from "./components/setSts";
import add from "./components/add";

const reason = [
    { id: 0, title: "无" },
    { id: 1, title: "账号用户名截图错误" },
    { id: 2, title: "京东实名认证截图错误" },
    { id: 3, title: "账号等级截图错误" },
    { id: 4, title: "京东白条截图错误" },
    { id: 5, title: "京东账号不符合要求" },
    { id: 6, title: "照妖镜存在跑单记录" },
    {
        id: 7,
        title:
            "此账号不符合平台绑定要求，不要再申请这个账号绑定，一样会被驳回。请更换其他账号进行审核绑定，请更换其他没有被删除评价的账号进行绑定审核即可，无需联系客服咨询，结果是一样的。"
    }
];

export default {
    name: "推广员列表",
    components: {
        update,
        setSts,
        add
    },
    data() {
        return {
            reason,
            // 遮罩层
            loading: false,
            listLoading: false,

            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deptId: "",
                id: "",
                exAccount: "",
                exAccountName: "",
                isSurplus: "0"
            }
        };
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            disableType: "status/disableType"
        }),
        disableKV() {
            return this.disableType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    created() {
        let id = this.$route.query.id;
        if (id) {
            this.queryParams.id = id;
        }
        this.getList();
    },
    methods: {
        filterDisable(row) {
            return this.disableKV[row.state];
        },
        filterTime() {
            if (
                this.queryParams.startTime &&
                this.queryParams.startTime.length != 19
            ) {
                this.queryParams.startTime = dateFortmat(
                    this.queryParams.startTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.lastLoginTime &&
                this.queryParams.lastLoginTime.length != 10
            ) {
                this.queryParams.lastLoginTime = dateFortmat(
                    this.queryParams.lastLoginTime,
                    "yyyy-MM-dd"
                );
            }
            if (
                this.queryParams.endTime &&
                this.queryParams.endTime.length != 19
            ) {
                this.queryParams.endTime = dateFortmat(
                    this.queryParams.endTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
        },
        handleOpen(refName, index, sts) {
            var target = this.$refs[refName];
            if (index != undefined) {
                const f = this.postList[index];
                if (sts == undefined) {
                    Object.assign(target.form, f);
                    // target.getInfo();
                } else {
                    target.form.id = f.id;
                    target.form.note = "";
                    target.storeName = f.exAccountName;
                    target.actionType = sts;
                    target.form.password = "";
                    target.form.bindPassword = "";
                    target.form.state = 1;
                }
            }
            target.dialogVisible = true;
        },
        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id };
            this.$confirm(
                "确定要进行 " + data.exAccountName + " 审核通过 操作吗？"
            )
                .then(() => reivew(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleEnable(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, note: "", state: 0 };
            this.$confirm("确定要进行 " + data.exAccountName + " 启用 操作吗？")
                .then(() => disabled(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },

        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            this.filterTime();
            fetchList(this.queryParams)
                .then(response => {
                    this.postList = response.data.list;
                    this.total = response.data.total;
                })
                .finally(e => {
                    this.listLoading = false;
                });
        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },

        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
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
/deep/.cell {
    text-align: center;
    .el-row {
        margin-bottom: 2px;
    }
    .el-input__inner {
        width: 88px;
    }
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
</style>