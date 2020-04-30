<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">
            <el-form-item>
                <el-date-picker :editable="false" clearable v-model="queryParams.startTime" default-time="00:00:00" align="right" type="datetime" placeholder="绑定起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" clearable v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="绑定结束日期"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
        <el-select v-model="queryParams.state">
          <el-option label="限制接单" value="" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-select v-model="queryParams.buyerStatus" clearable>
                    <el-option label="买手账户状态" value="" />
                    <el-option label="正常" value="0" />
                    <el-option label="禁用" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.buyerQualityStatus" clearable>
                    <el-option label="买手质量状态" value="" />
                    <el-option label="优质账号" value="1" />
                    <el-option label="普通账号" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.bindAccountType" clearable>
                    <el-option label="买号类型" value="" />
                    <el-option label="淘宝" value="1" />
                    <el-option label="京东" value="2" />
                    <el-option label="拼多多" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.accountStatus" clearable>
                    <el-option label="审核状态" value="" />
                    <el-option v-for="item in status" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.isBlack" clearable>
                    <el-option label="旺旺号拉黑" value="" />
                    <el-option label="拉黑" value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="旺旺账号" v-model="queryParams.bindAccountName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <!-- <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleExport">导出</el-button> -->
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->

            <el-table-column width="100px" label="买手ID" align="center" prop="buyerId" />
            <el-table-column label="买手账号" align="center" prop="bindAccountName" />
            <el-table-column label="手机号码" width="110px" align="center" prop="buyerAccount" />
            <el-table-column width="65px" label="类型" align="center" prop="bindAccountType" :formatter="filterPlatform" />

            <el-table-column width="160px" label="绑定时间" align="center" prop="bindTime" />

            <el-table-column width="50px" label="状态" align="center" prop="buyerStatus" :formatter="filterDisable">
                <template slot-scope="{row}">
                    <span :class="'xl-normal-'+row.buyerStatus">{{filterDisable(row)}}</span>
                </template>
            </el-table-column>

            <el-table-column width="80px" label="旺旺状态" align="center" prop="accountStatus" :formatter="filterAccount">
                <template slot-scope="{row}">
                    <span :class="'xl-review-'+row.accountStatus">{{filterAccount(row)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="48px" label="优质" align="center" prop="buyerQualityStatus">
                <template slot-scope="{ row }">
                    <span>{{ row.buyerQualityStatus | filterExcellent }}</span>
                </template>
            </el-table-column>
            <el-table-column width="80px" label="旺旺拉黑" align="center" prop="isBlack" :formatter="filterBlack" />
            <el-table-column label="备注" align="center" prop="blackNote">
                <template slot-scope="{ row }">
                    {{  row.blackNote  }}
                </template>
            </el-table-column>
            <el-table-column width="350px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{ row, $index }">
                    <el-button v-hasPermi="['system:account:buyerInfo:delete']" type="danger" :loading="loading" size="small" icon="el-icon-delete" @click="handleReview($index, 0)">删除</el-button>
                    <el-button v-hasPermi="['system:account:buyerInfo:update']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('update', $index)">修改</el-button>
                    <el-button v-hasPermi="['system:account:buyerInfo:black']" v-if="row.isBlack == 0" type="info" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 1)">拉黑</el-button>
                    <el-button v-hasPermi="['system:account:buyerInfo:black']" v-else type="primary" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 1)">解黑</el-button>
                    <el-button v-hasPermi="['system:account:buyerInfo:disable']" v-if="row.accountStatus != 4" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 0)">禁用</el-button>
                    <el-button v-hasPermi="['system:account:buyerInfo:disable']" v-else type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 0)">启用</el-button>
                </template>
            </el-table-column>

        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
        <set-sts ref="setSts" @getList="getList" :reason="reason"></set-sts>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { dateFortmat } from "@/utils";
import { fetchList, del } from "@/api/buyer/all";
import update from "./components/update";
import setSts from "./components/setSts";
import area from "@/utils/area_data1";

const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);
const status = [
    { key: 0, value: "待审核" },
    { key: 1, value: "审核通过" },
    { key: 2, value: "审核拒绝" }
];
const allKV = all.reduce((l, v) => {
    l[v.c] = v.a;
    return l;
}, {});

const excellentKV = {
    0: "",
    1: "优"
};

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

const reasonKV = reason.reduce((l, v) => {
    l[v.id] = v.title;
    return l;
}, {});

export default {
    name: "买手账号列表",
    components: {
        update,
        setSts
    },
    data() {
        return {
            reason,
            status,
            // 遮罩层
            loading: false,
            listLoading: false,
            review: {
                title: ["删除"],
                fn: [del],
                data: null
            },

            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                auditState: "",
                buyerAccount: "",
                buyerId: "",
                isBlack: "",
                accountStatus: "",
                bindAccountName: "",
                bindAccountType: "",
                buyerQualityStatus: "",
                buyerStatus: "",
                endTime: "",
                startingTime: ""
            }
        };
    },
    created() {
        this.getList();
    },
    filters: {
        filterGender(gender) {
            return genderKeyValue[gender];
        },

        filterAddress(code) {
            return allKV[code];
        },
        filterExcellent(type) {
            return excellentKV[type];
        },
        filterReason(type) {
            return reasonKV[type];
        }
    },
    watch: {
        state(v) {
            if (v == 3) {
                this.queryParams.auditState = 2;
                this.queryParams.isBlack = 1;
            } else {
                this.queryParams.auditState = v;
                this.queryParams.isBlack = "";
            }
        }
    },
    computed: {
        ...mapGetters({
            accountType: "status/accountType",
            platformType: "status/platformType",
            disableType: "status/disableType"
        }),

        accountKV() {
            return this.accountType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        },
        platformKV() {
            return this.platformType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        },
        disableKV() {
            return this.disableType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    methods: {
        filterAccount(row) {
            return this.accountKV[row.accountStatus];
        },
        filterDisable(row) {
            return this.disableKV[row.buyerStatus];
        },
        filterPlatform(row) {
            return this.platformKV[row.bindAccountType];
        },
        filterBlack(row) {
            return row.isBlack ? "已拉黑" : "";
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
            const f = this.postList[index];
            if (sts == undefined) {
                // Object.assign(target.form, f);
                target.bindAccountId = f.bindAccountId;
                target.platform = f.bindAccountType;
                target.getInfo();
            } else {
                target.form.isBlack = f.isBlack;
                target.form.accountStatus = f.accountStatus;
                target.form.control = sts;
                target.form.id = f.id;
                target.bindAccountName = f.bindAccountName;
                target.bindAccountType = f.bindAccountType;
                target.blackNote = "";
                target.blackNote123 = "";
            }
            target.dialogVisible = true;
        },
        showReason(remark) {
            return remark == "";
        },
        handleReview(index, sts) {
            this.loading = true;
            var data = this.postList[index];
            this.$confirm(
                "确定要进行 " +
                    data.bindAccountName +
                    " " +
                    this.review.title[sts] +
                    " 操作吗？"
            )
                .then(r => {
                    var d;
                    if (sts < 2) {
                        d = { id: data.id };
                    } else {
                        d = { id: data.id, note: data.note };
                    }
                    this.review.fn[sts](d)
                        .then(r => {
                            this.getList();
                            this.$message.success(r.msg);
                        })
                        .finally(e => {
                            this.loading = false;
                        });
                })
                .catch(r => {
                    this.loading = false;
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
.xl-review-2,
.xl-normal-1 {
    color: #ff4949;
}
.xl-review-1 {
    color: #13ce66;
}
.xl-review-0 {
    color: #1890ff;
}
</style>
