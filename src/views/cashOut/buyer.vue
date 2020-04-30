<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item>
                <el-select v-model="queryParams.auditState" clearable>
                    <el-option label="提现状态" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in simpleRechargeType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.hasRechargeRecently" clearable>
                    <el-option label="最近后台充值" value="" />
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="起始提现日期" v-model="queryParams.withdrawStartTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="终止提现日期" v-model="queryParams.withdrawEndTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="操作日期" v-model="queryParams.auditTime" align="right" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="操作者" v-model="queryParams.auditName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="起始买手ID" v-model="queryParams.buyerStartId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="终止买手ID" v-model="queryParams.buyerEndId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="手机号" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="开户名" v-model="queryParams.bankAccountName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:auditOne']" type="warning" icon="el-icon-edit" size="mini" @click="handleMutiplePass">批量审核</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:auditTwo']" type="danger" icon="el-icon-edit" size="mini" @click="handleMutiplePass1">批量兑现</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:excel:quanzhou']" type="success" icon="el-icon-download" size="mini" @click="handleQZExport">导出泉州银行模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:excel:ruralCredit']" type="success" icon="el-icon-download" size="mini" @click="handleNXExport">导出农信银行模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:excel:everbrightBank']" type="success" icon="el-icon-download" size="mini" @click="handleGDExport">导出光大银行模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:excel:xiamenInternationalBank']" type="success" icon="el-icon-download" size="mini" @click="handleXMExport">导出厦门国际银行模板</el-button>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" v-hasPermi="['system:withdraw:buyer:excel']" type="success" icon="el-icon-download" size="mini" @click="handleExport">普通导出</el-button>
            </el-form-item>
        </el-form>
        <el-table v-loading="listLoading" :data="postList" border @selection-change="handleSelection">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="买手ID" align="center" prop="buyerId">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.buyerId)">{{row.buyerId}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="所属站点" align="center" prop="deptId" :formatter="filterDept" /> -->
            <el-table-column label="提现日期" width="95px" align="center" prop="withdrawTime">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        {{row.withdrawTime}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="提现方式" width="240px" align="center" prop="withdrawType">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        <el-row>{{row.bankAccountName}}</el-row>
                        <el-row>{{row.bankName}}</el-row>
                        <el-row>{{row.bankCardNumber}}</el-row>
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="提现金额" align="center" prop="withdrawMoney">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        <el-row>￥{{row.withdrawMoney}}</el-row>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="最近是否有后台充值" width="160px" align="center" prop="hasRechargeRecently">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        {{row.hasRechargeRecently?'是':''}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="115px" label="操作员/操作时间" align="center" prop="status">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        <el-row>{{row.auditName}}</el-row>
                        <div style="width:75px;margin:0 auto;">{{row.auditTime}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作员备注" align="center" prop="note">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        {{row.note}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="auditState" :formatter="filterRecharge">
                <template slot-scope="{row}">
                    <div :class="filterHasRechargeRecently(row)">
                        {{filterRecharge(row)}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column width=" 100px" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <el-row>
                        <el-button v-hasPermi="['system:withdraw:buyer:auditOne']" v-if="row.auditState==1" type="success" :loading="loading" size="mini" @click="handlePass($index)">审核通过</el-button>
                        <el-button v-hasPermi="['system:withdraw:buyer:auditTwo']" v-else-if="row.auditState==2" type="success" :loading="loading" size="mini" @click="handlePass1($index)">兑现</el-button>
                    </el-row>
                    <el-row>
                        <el-button v-hasPermi="['system:withdraw:buyer:auditOne']" v-if="row.auditState==1||row.auditState==2" type="danger" :loading="loading" size="mini" @click="handleOpen('setSts',$index,0)">审核拒绝</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <setSts ref="setSts" @getList="getList"></setSts>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <detail ref="detail"></detail>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import {
    fetchList,
    exportQZExcel,
    exportExcel,
    review,
    review1,
    exportNXExcel,
    exportGDExcel,
    exportXMExcel
} from "@/api/cashOut/buyer";
import { dateFortmat } from "@/utils";
import detail from "../buyer/detail";
import setSts from "./components/setSts";
export default {
    name: "买手-提现",
    components: { setSts, detail },
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
                buyerStartId: "",
                buyerEndId: "",
                auditState: 1,
                withdrawType: "",
                withdrawStartTime: "",
                withdrawEndTime: "",
                auditTime: "",
                auditName: "",
                buyerId: "",
                buyerAccount: "",
                deptId: "",
                hasRechargeRecently: ""
            }
        };
    },
    created() {
        const date = new Date(Date.now() - 24 * 60 * 60 * 1000 * 7);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        this.queryParams.withdrawStartTime = date;
        this.getList();
    },
    computed: {
        ...mapGetters({
            //  deptType: 'status/deptType',
            simpleRechargeType: "status/simpleRechargeType",
            moneyType: "status/moneyType",
            simpleRechargeKV: "status/simpleRechargeKV"
        }),
        ...mapState(["common"]),
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
        filterHasRechargeRecently(row) {
            return row.hasRechargeRecently ? "xl-red" : "";
        },
        handleOpenDetail(id) {
            this.$refs.detail.visible = true;
            this.common.buyerId = id;
            this.$refs.detail.initOne({ index: "0" });
        },
        handleSelection(list) {
            this.dataList = list;
        },
        // filterDept(row) {
        //   return this.deptKV[row.deptId];
        // },
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
                target.bindAccountName = f.buyerId;
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
            this.$confirm("确定要进行买手ID " + data.buyerId + " 兑现 操作吗？")
                .then(() => review(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
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
        handleQZExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出泉州模板数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportQZExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
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
        },
        handleNXExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出农信模板数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportNXExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
        },
        handleGDExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出光大模板数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportGDExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
        },
        handleXMExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出厦门模板数据?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportXMExcel(this.queryParams)
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
.xl-red {
    color: #f00;
}
</style>