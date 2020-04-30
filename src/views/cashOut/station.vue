<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item>
                <el-select v-model="queryParams.state" clearable>
                    <el-option label="提现状态" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in simpleRechargeType" />

                </el-select>
            </el-form-item>
            <el-form-item prop="status">
                <el-select v-model="queryParams.deptId" clearable size="small">
                    <el-option label="所属站点" value="" />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="起始提现日期" v-model="queryParams.startingTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="终止提现日期" v-model="queryParams.endTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="操作日期" v-model="queryParams.operTime" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="操作者" v-model="queryParams.auditName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:dept:auditOne']" type="success" icon="el-icon-search" size="mini" @click="handleMutiplePass">批量审核</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:dept:auditTwo']" type="warning" icon="el-icon-search" size="mini" @click="handleMutiplePass1">批量兑现</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:dept:excel']" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="postList" border @selection-change="handleSelection">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="提现分站" align="center" prop="sysDept.deptName" />
            <el-table-column label="提现日期" width="95px" align="center" prop="withdrawTime" />
            <el-table-column label="提现方式" width="130px" align="center" prop="withdrawType">
                <template slot-scope="{row}">
                    <el-row>{{row.sysDeptLeaderInfo.bindBankName}}</el-row>
                    <el-row>{{row.sysDeptLeaderInfo.bankName}}</el-row>
                    <el-row>{{row.sysDeptLeaderInfo.bindBankNumber}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="提现金额" align="center" prop="withdrawAmount">
                <template slot-scope="{row}">
                    <el-row>￥{{row.withdrawAmount}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="操作员/操作时间" align="center" prop="status">
                <template slot-scope="{row}">
                    <el-row>{{row.auditName}}</el-row>
                    <el-row>{{row.operTime}}</el-row>
                </template>
            </el-table-column>
            <el-table-column label="操作员备注" align="center" prop="auditNote" success />
            <el-table-column label="状态" align="center" prop="state" :formatter="filterRecharge" />
            <el-table-column width=" 100px" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <el-row>
                        <el-button v-hasPermi="['system:withdraw:dept:auditOne']" v-if="row.state==1" type="success" :loading="loading" size="mini" @click="handlePass($index)">审核通过</el-button>
                        <el-button v-hasPermi="['system:withdraw:dept:auditTwo']" v-if="row.state==2" type="success" :loading="loading" size="mini" @click="handlePass1($index)">兑现</el-button>
                    </el-row>
                    <el-row>
                        <el-button v-hasPermi="['system:withdraw:dept:auditOne']" v-if="row.state==2||row.state==1" type="danger" :loading="loading" size="mini" @click="handleOpen('setSts',$index,0)">审核拒绝</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <setSts ref="setSts" @getList="getList"></setSts>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, exportExcel, review, review1 } from "@/api/cashOut/station";
import { dateFortmat } from "@/utils";
import setSts from "./components/setSts";
export default {
    name: "分站-提现",
    components: { setSts },
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
            dataList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 50,
                startingTime: "",
                deptId: "",
                endTime: "",
                operTime: "",
                state: 1
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
            simpleRechargeKV: "status/simpleRechargeKV"
        }),
        deptKV() {
            if (this.deptType) {
                return this.deptType.reduce((l, v) => {
                    l[v.deptId] = v.deptName;
                    return l;
                }, {});
            } else {
                return {};
            }
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
        handleSelection(list) {
            this.dataList = list;
        },
        filterDept(row) {
            return this.deptKV[row.deptId];
        },
        filterRecharge(row) {
            return this.simpleRechargeKV[row.state];
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
                this.queryParams.operTime &&
                this.queryParams.operTime.length != 10
            ) {
                this.queryParams.operTime = dateFortmat(
                    this.queryParams.operTime,
                    "yyyy-MM-dd"
                );
            }
        },
        handleOpen(refName, index, sts) {
            var target = this.$refs[refName];
            const f = this.postList[index];
            if (sts == undefined) {
                // Object.assign(target.form, f);
                target.bindAccountId = f.bindAccountId;
                target.platform = f.bindAccountType;
                target.getInfo();
            } else {
                target.controlIndex = sts;
                target.form.note = "";
                target.form.id = f.id;
                target.bindAccountName = this.filterDept(f);
                target.review = review;
            }
            target.dialogVisible = true;
        },

        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 2, note: "" };
            review(postData)
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .finally(() => (this.loading = false));
            return;
            this.$confirm(
                "确定要进行分站 " + this.filterDept(data) + " 审核通过 操作吗？"
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
            review1(postData)
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .finally(() => (this.loading = false));
            return;
            this.$confirm(
                "确定要进行分站 " + this.filterDept(data) + " 兑现 操作吗？"
            )
                .then(() => review(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleMutiplePass() {
            const leng = this.dataList.length;
            if (leng == 0) {
                this.$message.error("请先选择要处理的对象");
                return;
            }
            this.loading = true;
            var finishLength = 0;
            var successLength = 0;
            this.dataList.map(v => {
                const id = v.id;
                const auditState = 2;
                const note = "";
                review({
                    id,
                    auditState,
                    note
                })
                    .then(() => successLength++)
                    .finally(() => {
                        finishLength++;
                        if (finishLength == leng) {
                            this.$message.success(
                                "处理完成，成功" + successLength + "次"
                            );
                            this.loading = false;
                            this.getList();
                        }
                    });
            });
        },
        handleMutiplePass1() {
            var dataList = this.dataList.filter(v => v.auditState == 2);
            const leng = dataList.length;
            if (leng == 0) {
                this.$message.error("请先选择要处理的对象");
                return;
            }
            this.loading = true;
            var finishLength = 0;
            var successLength = 0;
            dataList.map(v => {
                const id = v.id;
                const auditState = 3;
                const note = "";
                review1({
                    id,
                    auditState,
                    note
                })
                    .then(() => successLength++)
                    .finally(() => {
                        finishLength++;
                        if (finishLength == leng) {
                            this.$message.success(
                                "处理完成，成功" + successLength + "次"
                            );
                            this.loading = false;
                            this.getList();
                        }
                    });
            });
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
        margin-bottom: 6px;
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
    .el-button {
        width: 100%;
    }
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
</style>