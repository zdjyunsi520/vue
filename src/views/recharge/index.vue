<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">
            <el-form-item prop="postCode">
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="手机号码" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="商家开户人" v-model="queryParams.bankAccountName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="平台开户人" v-model="queryParams.bindBankName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item prop="postCode">
                <el-input placeholder="申请时间" v-model="queryParams.applyTime" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item prop="postCode">
                <el-input placeholder="一审操作员" v-model="queryParams.auditName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="一审开始时间" v-model="queryParams.auditStartingTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="一审结束时间" v-model="queryParams.auditEndTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="二审操作员" v-model="queryParams.refAuditName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="二审开始时间" v-model="queryParams.refStartingTime" default-time="00:00:00" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" placeholder="二审结束时间" v-model="queryParams.refEndTime" default-time="23:59:59" align="right" type="datetime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState" clearable>
                    <el-option label="审核状态" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in rechargeType" />
                </el-select>
            </el-form-item>
            <el-form-item prop="status">
                <el-select v-model="queryParams.deptId" clearable size="small">
                    <el-option label="所属站点" value="" />
                    <el-option :key="item.deptName" :label="item.deptName" :value="item.deptId" v-for="item in deptType" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
            <el-form-item>
                <el-button v-hasPermi="['system:mer:recharge:excel']" :loading="loading" type="warning" icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="商家ID" align="center" prop="merId" />
            <el-table-column label="归属网站" align="center" prop="deptId" :formatter="filterDept" />
            <el-table-column label="手机号" width="110px" align="center" prop="merAccount" />
            <el-table-column label="交易编号" align="center" prop="rechargeNumber" />
            <el-table-column label="申请时间" width="95px" align="center" prop="rechargeTime" />
            <el-table-column label="充值资金" align="center" prop="transferMoney" />
            <el-table-column width="170px" label="支付方式" align="center">
                <template slot-scope="{row}">
                    <el-row>{{row.bankAccountName}}</el-row>
                    <el-row>{{row.bankName}}</el-row>
                    <el-row>{{row.bankCardNumber}}</el-row>
                </template>
            </el-table-column>
            <el-table-column prop="merRemark" label="转账备注"> </el-table-column>
            <el-table-column prop="screenShot" label="充值截图">
                <template slot-scope="{row}">
                    <img @click="handleShow(row.screenShot)" :src="row.screenShot1" v-if="row.screenShot1" alt="">
                </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center" prop="auditState" :formatter="filterRecharge" />
            <el-table-column label="一审信息" width="110px" align="center">
                <template slot-scope="{row}">
                    <el-row>{{row.auditName}}</el-row>
                    <div style="width:75px;margin:0 auto;">{{row.auditTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="二审信息" width="110px" align="center">
                <template slot-scope="{row}">
                    <el-row>{{row.auditSucName}}</el-row>
                    <div style="width:75px;margin:0 auto;">{{row.auditSucTime}}</div>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="note" />
            <el-table-column width="100px" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <el-row>
                        <el-button v-hasPermi="['system:mer:recharge:auditOne']" v-if="row.auditState==0" type="success" :loading="loading" size="mini" @click="handlePass($index)">初核通过</el-button>
                        <el-button v-hasPermi="['system:mer:recharge:auditTwo']" v-if="row.auditState==1" type="success" :loading="loading" size="mini" @click="handlePass1($index)">复审通过</el-button>
                    </el-row>
                    <el-row>
                        <el-button v-hasPermi="['system:mer:recharge:auditOne']" v-if="row.auditState==0" type="danger" :loading="loading" size="mini" @click="handleOpen('setSts',$index,0)">初核拒绝</el-button>
                        <el-button v-hasPermi="['system:mer:recharge:auditTwo']" v-if="row.auditState==1" type="danger" :loading="loading" size="mini" @click="handleOpen('setSts',$index,1)">复审拒绝</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <setSts ref="setSts" @getList="getList"></setSts>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <show-image ref="showImage"></show-image>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
import {
    fetchList,
    review,
    review1,
    exportExcel
} from "@/api/recharge/sellerManager";
import setSts from "./components/setSts";
import showImage from "@/components/showImage";
export default {
    name: "充值列表",
    components: {
        setSts,
        showImage
    },

    data() {
        return {
            process: "?x-oss-process=image/resize,h_50",
            // 遮罩层
            loading: false,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            listLoading: true,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                merId: "",
                merAccount: "",
                bankAccountName: "",
                bindBankName: "",
                applyTime: "",
                auditName: "",
                auditStartingTime: "",
                auditEndTime: "",
                refAuditName: "",
                refStartingTime: "",
                refEndTime: "",
                auditState: "",
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
            rechargeType: "status/rechargeType",
            path: "imgOSS/path"
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
        }
    },
    methods: {
        handleShow(url) {
            this.$refs.showImage.url = url;
            this.$refs.showImage.dialogVisible = true;
        },
        filterDept(row) {
            return this.deptKV[row.deptId];
        },
        filterRecharge(row) {
            return this.rechargeKV[row.auditState];
        },
        filterIMG(row) {
            let src = "";
            row.screenShot && (src = this.path + row.screenShot + this.process);
            return src;
        },
        /** 查询岗位列表 */
        getList() {
            this.filterTime();
            this.listLoading = true;
            fetchList(this.queryParams).then(response => {
                this.postList = response.data.list.map(v => {
                    v.screenShot1 = this.filterIMG(v);
                    return v;
                });
                this.total = response.data.total;
                this.listLoading = false;
            });
        },
        filterTime() {
            if (
                this.queryParams.auditStartingTime &&
                this.queryParams.auditStartingTime.length != 19
            ) {
                this.queryParams.auditStartingTime = dateFortmat(
                    this.queryParams.auditStartingTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.auditEndTime &&
                this.queryParams.auditEndTime.length != 19
            ) {
                this.queryParams.auditEndTime = dateFortmat(
                    this.queryParams.auditEndTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.refStartingTime &&
                this.queryParams.refStartingTime.length != 10
            ) {
                this.queryParams.refStartingTime = dateFortmat(
                    this.queryParams.refStartingTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.refEndTime &&
                this.queryParams.refEndTime.length != 10
            ) {
                this.queryParams.refEndTime = dateFortmat(
                    this.queryParams.refEndTime,
                    "yyyy-MM-dd hh:mm:ss"
                );
            }
            if (
                this.queryParams.applyTime &&
                this.queryParams.applyTime.length != 10
            ) {
                this.queryParams.applyTime = dateFortmat(
                    this.queryParams.applyTime,
                    "yyyy-MM-dd hh:mm:ss"
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
                target.bindAccountName = f.rechargeNumber;
            }
            target.dialogVisible = true;
        },

        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { id: data.id, auditState: 1, note: "" };
            this.$confirm(
                "确定要进行交易编号 " +
                    data.rechargeNumber +
                    " 初审通过 操作吗？"
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
            var postData = { id: data.id, auditState: 2, note: "" };
            this.$confirm(
                "确定要进行交易编号 " +
                    data.rechargeNumber +
                    " 复审通过 操作吗？"
            )
                .then(() => review1(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
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
            this.$confirm("是否确认导出所有数据?", "警告", {
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