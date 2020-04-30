<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" class="xl-query">
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.lastLoginTime" align="right" type="date" placeholder="最后登录时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startingTime" default-time="00:00:00" align="right" type="datetime" placeholder="注册时间起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="选择结束日期"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
        <el-select v-model="queryParams.state">
          <el-option label="限制接单" value="" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-input placeholder="推广员ID" v-model="queryParams.promoterId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="QQ" v-model="queryParams.qq" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="买手ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="邀请码" v-model="queryParams.recommendCode" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button :loading="loading" type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:buyer:info:excel']">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="买手ID" align="center" prop="id">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.id)">{{row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="手机号码" width="115px" align="center" prop="buyerAccount" />
            <el-table-column label="推广员ID" align="center" prop="promoterId" />
            <el-table-column label="付费团名称" align="center" prop="groupName" />
            <el-table-column label="QQ" align="center" prop="qq" />
            <el-table-column label="邀请码" align="center" prop="recommendCode" />
            <el-table-column label="累计邀请" align="center" prop="totalInvite" />
            <el-table-column label="本金" align="center" prop="bbuyerAccountInfo.usablePrincipal" />
            <el-table-column label="佣金" align="center" prop="bbuyerAccountInfo.usableBrokerage" />
            <el-table-column label="最后登录" align="center" prop="lastLoginTime" width="95px" />
            <el-table-column label="注册时间" align="center" prop="registerTime" width="95px" />
            <el-table-column label="备注" align="center" prop="note" />
            <el-table-column width="280px" label="操作" align="center" class-name="small-padding fixed-width xl-button-margin">
                <template slot-scope="{ row, $index }">
                    <el-button v-hasPermi="['system:buyer:info:update']" type="warning" :loading="loading" size="small" @click="handleOpen('update', $index)">修改</el-button>
                    <el-button v-hasPermi="['system:buyer:info:disable']" v-if="row.state == 0" type="danger" :loading="loading" size="small" @click="handleOpen('setSts', $index, 0)">禁用</el-button>
                    <el-button v-hasPermi="['system:buyer:info:disable']" v-else type="success" :loading="loading" size="small" @click="handleEnable($index)">启用</el-button>
                    <el-button v-hasPermi="['system:buyer:info:updateWithdrawPassword']" type="primary" :loading="loading" size="small" @click="handleReset(row)">重置提现密码</el-button>
                    <el-button v-hasPermi="['system:buyer:info:black']" v-if="row.isBlack == 0" type="primary" :loading="loading" size="small" @click="handleOpen('black', $index, 1)">拉黑</el-button>
                    <el-button v-hasPermi="['system:buyer:info:black']" v-else type="info" :disabled="true" :loading="loading" size="small">已拉黑</el-button>

                    <el-button v-if="row.isSpecial != 1" v-hasPermi="['system:buyer:info:isSpecial']" type="success" :loading="loading" size="small" @click="handleSpecial(row.id,1)">设置三级</el-button>
                    <el-button v-hasPermi="['system:buyer:info:isSpecial']" v-else type="primary" :loading="loading" size="small" @click="handleSpecial(row.id,0)">取消三级</el-button>
                    <el-button v-hasPermi="['system:buyer:info:unusual:restore']" type="warning" :loading="loading" size="small" @click="handleOrderUpdate(row.buyerAccount)">接单修正</el-button>
                    <el-button v-hasPermi="['system:buyer:info:forbidden']" type="danger" :loading="loading" size="small" @click="handleOrderForbid(row)">禁止接单</el-button>
                    <el-button v-hasPermi="['system:buyer:info:sendMsgToBuyer']" type="primary" :loading="loading" size="small" @click="handleSend(row)">发送站内信</el-button>

                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
        <orderForbid ref="orderForbid"></orderForbid>
        <set-sts ref="setSts" @getList="getList" :reason="reason"></set-sts>
        <detail ref="detail"></detail>
        <black ref="black" @getList="getList"></black>
        <send-letter ref="sendLetter"></send-letter>
    </div>
</template>

<script>
import { dateFortmat } from "@/utils";
import {
    fetchList,
    disabled,
    exportExcel,
    special,
    orderUpdate,
    resetCashoutPwd
} from "@/api/buyer/info";
import { mapState } from "vuex";
import update from "./components/update";
import setSts from "./components/setSts";
import area from "@/utils/area_data1";
import detail from "../detail";
import black from "./components/black";
import orderForbid from "./components/orderForbid";
import sendLetter from "./components/sendLetter";
const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);

const allKV = all.reduce((l, v) => {
    l[v.c] = v.a;
    return l;
}, {});

const excellentKV = {
    0: "",
    1: "优"
};

const genderKeyValue = {
    0: "男",
    1: "女"
};
const status = [
    { id: 0, title: "未审核" },
    { id: 1, title: "审核通过" },
    { id: 2, title: "审核拒绝" },
    { id: 3, title: "审核拒绝" },
    { id: 4, title: "禁用旺旺号" }
];
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
const platformList = [
    { id: 1, title: "淘宝" },
    { id: 3, title: "京东" },
    { id: 2, title: "拼多多" }
];
const reasonKV = reason.reduce((l, v) => {
    l[v.id] = v.title;
    return l;
}, {});
const statusKeyValue = status.reduce((l, v) => {
    l[v.id] = v.title;
    return l;
}, {});
const platformKV = platformList.reduce((l, v) => {
    l[v.id] = v.title;
    return l;
}, {});
export default {
    name: "买手信息",
    components: {
        update,
        setSts,
        detail,
        black,
        orderForbid,
        sendLetter
    },
    data() {
        return {
            reason,
            status,
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
                lastLoginTime: "",
                startingTime: "",
                endTime: "",
                promoterId: "",
                buyerAccount: "",
                qq: "",
                id: "",
                recommendCode: ""
            }
        };
    },
    computed: {
        ...mapState(["common"])
    },
    created() {
        this.getList();
    },
    filters: {
        filterGender(gender) {
            return genderKeyValue[gender];
        },
        filterStatus(status) {
            return statusKeyValue[status];
        },
        filterAddress(code) {
            return allKV[code];
        },
        filterExcellent(type) {
            return excellentKV[type];
        },
        filterReason(type) {
            return reasonKV[type];
        },
        filterPlatform(id) {
            return platformKV[id];
        }
    },
    methods: {
        handleSelection(list) {
            this.merAccountList = list;
        },
        handleReset(data) {
            const buyerId = data.id;
            this.$confirm("确定把该买手提现密码改成和他登录密码一样吗？")
                .then(() => resetCashoutPwd({ buyerId }))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleSend(data) {
            let merAccountList = [];
            if (data) {
                merAccountList.push(data);
            } else {
                merAccountList = this.merAccountList;
            }
            if (merAccountList.length == 0) {
                this.$message.error("请先选择要发送站内信的买手");
                return;
            }
            var target = this.$refs.sendLetter;
            target.form.buyerId = merAccountList[0].id;
            target.buyerAccount = merAccountList[0].buyerAccount;
            target.handleOpen();
        },
        handleOrderForbid(row) {
            const target = this.$refs.orderForbid;
            target.handleOpen();
            target.form.buyerId = row.id;
            target.buyerAccount = row.buyerAccount;
        },
        handleOpenDetail(id) {
            this.$refs.detail.visible = true;
            this.common.buyerId = id;
            this.$refs.detail.initOne({ index: "0" });
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
        handleSpecial(id, isSpecial) {
            const postData = { id, isSpecial };
            this.$confirm("确定进行把该买手设为三级抽佣的操作吗？")
                .then(() => special(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleOrderUpdate(buyerAccount) {
            this.$confirm("确定进行把该买手接单情况异常修正的操作吗？")
                .then(() => orderUpdate(buyerAccount))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleOpen(refName, index, sts) {
            var target = this.$refs[refName];
            const f = this.postList[index];
            if (sts == undefined) {
                target.form.id = f.id;
                target.form.buyerAccount = f.buyerAccount;
                target.getInfo();
            } else {
                target.form.id = f.id;
                target.form.note = "";
                target.form.state = "";
                target.storeName = f.buyerAccount;
                target.buyerAccount = f.buyerAccount;
                target.actionType = sts;
                if (!sts) {
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
                "确定要进行 " + data.buyerAccount + " 审核通过 操作吗？"
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
            this.$confirm("确定要进行 " + data.buyerAccount + " 启用 操作吗？")
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
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
.xl-button-margin {
    .el-button {
        padding: 6px 0;
        margin-left: 0px;
        width: 60px;
        &:nth-child(-n + 3) {
            margin-bottom: 8px;
        }
        &:nth-child(3) {
            width: 125px;
        }
    }
    //  .el-button {
    //   width: 95px;
    // }
}
</style>
