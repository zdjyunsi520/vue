<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">

            <el-form-item prop="postCode">
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="status">
                <el-select v-model="queryParams.source" clearable size="small">
                    <el-option label="来源" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in sourceList" />
                </el-select>
            </el-form-item>
            <el-form-item prop="平台类型">
                <el-select v-model="queryParams.blackAccountPlatform" clearable size="small">
                    <el-option label="平台类型" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in platformType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.type" clearable>
                    <el-option label="身份类型" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in idCardList" />
                </el-select>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="值" v-model="queryParams.typeName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>

            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            <el-form-item>
                <el-button :loading="loading" type="success" @click="handleExport" size="mini">导出模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload v-hasPermi="['system:black:buyer:import']" accept=".xls,.xlsx" :on-success="handleSuccess" class="upload-demo" :action="action" :headers="headers" :show-file-list="false">
                    <el-button size="mini" :loading="loading" type="warning">导入黑名单</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button v-hasPermi="['system:black:buyer:add']" type="success" :loading="loading" size="mini" icon="el-icon-del" @click="handleOpen">单独添加</el-button>
                <!-- <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:post:export']">导出</el-button> -->
            </el-form-item>
            <el-form-item>
                <el-button v-hasPermi="['system:black:buyer:deletebylist']" type="danger" :loading="loading" size="mini" icon="el-icon-del" @click="handleDeletes">删除选中</el-button>
                <!-- <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:post:export']">导出</el-button> -->
            </el-form-item>
        </el-form>

        <el-table v-loading="listLoading" :data="postList" border @selection-change="handleSelection">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="名单编号" align="center" prop="id" />
            <el-table-column label="刷手ID" align="center" prop="buyerId" />
            <el-table-column label="来源" align="center" prop="source" :formatter="filterSource" />
            <el-table-column label="平台类型" width="95px" align="center" prop="blackAccountPlatform" :formatter="filterplatform" />
            <el-table-column label="身份类型" width="130px" align="center" prop="type" :formatter="filterIdCard">
            </el-table-column>
            <el-table-column label="值" align="center" prop="typeName" />
            <el-table-column label="拉黑时间" align="center" prop="blackTime" />
            <el-table-column label="备注" align="center" prop="note" />
            <el-table-column width=" 80px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-hasPermi="['system:black:buyer:remove']" type="danger" :loading="loading" size="small" icon="el-icon-del" @click="handleDelete($index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <addBlack ref="addBlack" @getList="getList"></addBlack>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, del, dels } from "@/api/buyer/black";
import { getToken } from "@/utils/auth";
import addBlack from "./components/addBlack";
const sourceList = [
    { key: 1, value: "平台添加" },
    { key: 2, value: "导入" }
];
const idCardList = [
    { key: 1, value: "账号" },
    { key: 2, value: "身份证号" },
    { key: 3, value: "银行卡号" },
    { key: 4, value: "平台用户名" },
    { key: 5, value: "QQ" }
];
const sourceKV = sourceList.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});
const idCardKV = idCardList.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});
export default {
    name: "买手黑名单",
    components: { addBlack },
    data() {
        return {
            idCardList,
            sourceList,
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
                blackAccountPlatform: "",
                blackTime: "",
                buyerId: "",
                source: "",
                type: "",
                typeName: "",
                ids: ""
            },
            action: "",
            headers: {}
        };
    },
    created() {
        this.getList();
        this.action =
            process.env.VUE_APP_BASE_API + "/system/black/buyer/import";
        this.headers = { Authorization: "Bearer " + getToken() };
    },
    computed: {
        ...mapGetters({
            platformType: "status/platformType",
            platformKV: "status/platformKV",
            path: "imgOSS/path"
        })
    },
    watch: {},
    methods: {
        filterplatform(row) {
            return this.platformKV[row.blackAccountPlatform];
        },
        filterSource(row) {
            return sourceKV[row.source];
        },
        filterIdCard(row) {
            return idCardKV[row.type];
        },
        filterTime() {
            if (
                this.queryParams.withdrawStartTime &&
                this.queryParams.withdrawStartTime.length != 19
            ) {
                this.queryParams.withdrawStartTime = dateFortmat(
                    this.queryParams.withdrawStartTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.withdrawEndTime &&
                this.queryParams.withdrawEndTime.length != 19
            ) {
                this.queryParams.withdrawEndTime = dateFortmat(
                    this.queryParams.withdrawEndTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.auditTime &&
                this.queryParams.auditTime.length != 10
            ) {
                this.queryParams.auditTime = dateFortmat(
                    this.queryParams.auditTime,
                    "yyyy-MM-dd"
                );
            }
        },
        handleOpen() {
            this.$refs.addBlack.dialogVisible = true;
        },
        handleSelection(list) {
            this.queryParams.ids = list.map(v => v.id).join(",");
        },
        handleDelete(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id };
            this.$confirm(
                "确定要进行名单编号 " + data.buyerId + " 删除 操作吗？"
            )
                .then(() => del(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleSuccess(r) {
            if (r.code) {
                this.$message.error(r.msg);
            } else {
                this.$message.success(r.msg);
            }
        },
        handleDeletes() {
            this.loading = true;
            var postData = { id: this.queryParams.ids };
            this.$confirm("确定要进行对选中的黑名单 删除 操作吗？")
                .then(() => dels(postData))
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
            location.href = this.path + "sysBuyerBlack.xlsx";
            return;
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出数据?", "警告", {
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
.upload-demo {
    display: inline-block;
}
</style>