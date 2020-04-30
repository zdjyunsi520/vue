<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item prop="status">
                <el-select v-model="queryParams.deptId" clearable size="small">
                    <el-option label="所属站点" value="" />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="反馈人ID" v-model="queryParams.feedbackId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="postList" border>
            <!-- <el-table-column type="selection" width="55" align="center"  />  :formatter="" -->
            <el-table-column label="反馈人ID" align="center" prop="feedbackId" />
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="反馈人类型" align="center" prop="feedbackType" :formatter="filterFeedback" />
            <el-table-column label="问题描述" align="center" prop="content" />

            <el-table-column label="截图" align="center" prop="url">
                <template slot-scope="{row}">
                    <el-row class="xl-row-img" v-for="item in row.url.split(',').filter(v=>v!='')">
                        <img @click="handleShow(item)" :src="path+item+process" alt="" />
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="提交时间" align="center" prop="feedbackTime" />
            <el-table-column label="回复内容" align="center" prop="replyContent" />
            <el-table-column label="解决时间" align="center" prop="solveTime" />
            <el-table-column width="100px" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <el-row>
                        <el-button v-hasPermi="['system:feedback:dispose:updateFeedback']" type="success" :loading="loading" size="mini" @click="handleOpen('setSts',row.id)">回复</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <setSts ref="setSts" @getList="getList"></setSts>
        <show-image ref="showImage"></show-image>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList } from "@/api/feedBack";
import setSts from "./components/setSts";
import showImage from "@/components/showImage";
export default {
    name: "意见反馈",
    components: { setSts, showImage },
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            deptList: null,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            process: "?x-oss-process=image/resize,h_60",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                feedbackId: "",
                deptId: ""
            }
        };
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            simpleRechargeType: "status/simpleRechargeType",
            moneyType: "status/moneyType",
            simpleRechargeKV: "status/simpleRechargeKV",
            path: "imgOSS/path"
        }),
        deptKV() {
            return this.deptType.reduce((l, v) => {
                l[v.deptId] = v.deptName;
                return l;
            }, {});
        },
        rechargeKV() {
            return this.rechargeType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        },
        moneyKV() {
            return this.moneyType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    watch: {},
    methods: {
        filterFeedback(row) {
            return row.feedbackType == 1
                ? "买手"
                : row.feedbackType == 2
                ? "商家"
                : "推广员";
        },
        handleShow(url) {
            this.$refs.showImage.url = url;
            this.$refs.showImage.dialogVisible = true;
        },
        filterDept(row) {
            return this.deptKV[row.deptId];
        },
        filterRecharge(row) {
            return this.simpleRechargeKV[row.auditState];
        },
        filterMoney(id) {
            return this.moneyKV[id];
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
        handleOpen(refName, id) {
            var target = this.$refs[refName];
            target.form.id = id;
            target.dialogVisible = true;
        },

        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 2, note: "" };
            this.$confirm(
                "确定要进行买手ID " + data.buyerId + " 审核通过 操作吗？"
            )
                .then(() => review(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handlePass1(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 3, note: "" };
            this.$confirm("确定要进行买手ID " + data.buyerId + " 兑现 操作吗？")
                .then(() => review(postData))
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
.xl-row-img {
    max-height: 200px;
    overflow: hidden;
    img {
        width: 60px;
        height: 60px;
        cursor: pointer;
    }
}
</style>