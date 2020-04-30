<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" class="xl-query">
            <!-- <el-form-item label="最后登录时间">
        <el-date-picker :editable="false" v-model="queryParams.startTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item> -->
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startingTime" default-time="00:00:00" align="right" type="datetime" placeholder="注册起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
        <el-select v-model="state">
          <el-option label="是否支付" value="" />
          <el-option v-for="item in status" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-select v-model="queryParams.taskPlatformId" clearable>
                    <el-option label="所属平台" value="" />
                    <el-option v-for="item in platformList" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.storeStatus" clearable>
                    <el-option label="店铺状态" value="" />
                    <el-option v-for="item in status" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.deptId" clearable>
                    <el-option label="所属站点" value="" />
                    <el-option v-for="item in deptType" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="店铺名称" v-model="queryParams.storeName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="店铺旺旺" v-model="queryParams.storeAccountName" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column width="60px" label="店铺ID" align="center" prop="storeId" />
            <el-table-column width="60px" label="商家ID" align="center" prop="merId">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.merId)">{{row.merId}}</span>
                </template>
            </el-table-column>
            <el-table-column width="80px" label="所属站点" align="center" prop="deptName" />
            <el-table-column width="110px" label="店铺名称" align="center" prop="storeName" />
            <el-table-column label="旺旺ID" align="center" prop="storeAccountId" />
            <el-table-column width="110px" label="商家手机" prop="merAccount" />
            <el-table-column label="所属平台" align="center" prop="deptName">
                <template slot-scope="{ row }">
                    {{ filterPlatform(row) }}
                </template>
            </el-table-column>
            <el-table-column label="店铺地址">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.storeHomeUrl, $event)">复制链接</el-button>
                </template>
            </el-table-column>
            <el-table-column label="省" align="center" prop="province" :formatter="filterProvince" />
            <el-table-column label="市" align="center" prop="city" :formatter="filterCity" />
            <el-table-column label="区/县" align="center" prop="district" :formatter="filterDistrict" />
            <el-table-column width="95px" label="状态" align="center" prop="storeState" :formatter="filterAccount" />
            <el-table-column width="95px" label="绑定时间" prop="createTime" />

            <el-table-column width="395px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{ row, $index }" class="xl-table-column">
                    <el-button type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('update', $index)" v-hasPermi="['system:mer:store:update']">修改</el-button>
                    <el-button type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('transfer', row)" v-hasPermi="['system:mer:store:transfer']">店铺迁移</el-button>
                    <el-button type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleDelete($index)" v-hasPermi="['system:mer:store:delete']">删除</el-button>

                    <p v-if="row.storeState == 0">
                        <el-button type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handlePass($index)" v-hasPermi="['system:mer:store:by']">审核通过</el-button>
                        <el-button type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 1)" v-hasPermi="['system:mer:store:turnDown']">审核拒绝</el-button>
                    </p>

                    <!-- <el-button
            v-if="row.storeState != 0"
            type="primary"
            :loading="loading"
            size="small"
            icon="el-icon-edit"
            @click="handleExport"
             v-hasPermi="['system:buyer:info:excel']"
            >导出订单</el-button
          > -->
                    <el-button v-if="row.storeState > 0 && row.storeState < 3" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts', $index, 0)" v-hasPermi="['system:mer:store:disable']">禁用</el-button>
                    <el-button v-if="row.storeState == 3" type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleEnable($index)" v-hasPermi="['system:mer:store:disable']">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
        <set-sts ref="setSts" @getList="getList"></set-sts>
        <detail ref="detail"></detail>
        <transfer ref="transfer" @getList="getList"></transfer>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { dateFortmat } from "@/utils";
import { fetchList, disabled, exportExcel, review, del } from "@/api/shop";
import update from "./components/update";
import setSts from "./components/setSts";
import area from "@/utils/area_data1";
import detail from "../seller/detail";
import transfer from "./components/transfer";
import handleClipboard from "@/utils/clipboard";
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
    { key: 0, value: "未审核" },
    { key: 1, value: "审核通过" },
    { key: 2, value: "审核拒绝" }
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
    { key: 1, value: "淘宝" },
    { key: 2, value: "天猫" },
    { key: 3, value: "京东" },
    { key: 4, value: "拼多多" }
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
    l[v.key] = v.value;
    return l;
}, {});
export default {
    name: "店铺列表",
    components: {
        update,
        setSts,
        detail,
        transfer
    },
    data() {
        return {
            reason,
            status,
            // 遮罩层
            loading: false,
            listLoading: false,
            platformList,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                startingTime: "",
                endTime: "",
                taskPlatformId: "",
                storeStatus: "",
                deptId: "",
                merAccount: "",
                storeName: "",
                storeAccountName: "",
                merId: ""
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
            const name = platformKV[id];
            return name ? name : "淘宝";
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
            platformType: "status/platformType",
            deptType: "status/deptType",
            accountType: "status/accountType",
            allKV: "area/allKV"
        }),
        ...mapState(["common"]),

        deptKV() {
            return this.deptType
                ? this.deptType.reduce((l, v) => {
                      l[v.key] = v.value;
                      return l;
                  }, {})
                : null;
        },
        platformKV() {
            return this.platformType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        },
        accountKV() {
            return this.accountType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    methods: {
        handleClipboard,
        handleOpenDetail(id) {
            const target = this.$refs.detail;
            this.common.merId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        filterDept(row) {
            return this.deptKV[row.deptID];
        },
        filterPlatform(row) {
            return platformKV[row.taskPlatformId];
        },
        filterAccount(row) {
            return this.accountKV[row.storeState];
        },
        filterDistrict(row) {
            return this.allKV[row.district];
        },
        filterProvince(row) {
            return this.allKV[row.province];
        },
        filterCity(row) {
            return this.allKV[row.city];
        },
        filterTime() {
            if (
                this.queryParams.startingTime &&
                this.queryParams.endTime &&
                this.queryParams.startingTime > this.queryParams.endTime
            ) {
                const a = this.queryParams.startingTime;
                this.queryParams.startingTime = this.queryParams.endTime;
                this.queryParams.endTime = a;
            }
            if (
                this.queryParams.startingTime &&
                this.queryParams.startingTime.length != 19
            ) {
                this.queryParams.startingTime = dateFortmat(
                    this.queryParams.startingTime,
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
            if (refName == "transfer") {
                target.data = index;
            } else if (sts == undefined) {
                target.form.storeId = f.storeId;
                target.form.storeAccountId = f.storeAccountId;
                target.form.storeHomeUrl = f.storeHomeUrl;
                target.form.storeName = f.storeName;
                target.form.taskPlatformId = f.taskPlatformId;
                target.platform = platformKV[f.taskPlatformId];
            } else {
                target.form.storeId = f.storeId;
                target.form.remarks = "";
                target.form.storeStatus = "";
                target.storeName = f.storeName;
                target.actionType = sts;
                if (!sts) {
                    target.form.storeStatus = 3;
                }
            }
            target.dialogVisible = true;
        },
        handleDelete(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { storeId: data.storeId };
            this.$confirm("确定要进行 " + data.storeName + " 删除 操作吗？")
                .then(() => del(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .finally(() => (this.loading = false));
        },
        handlePass(index) {
            this.loading = true;
            var data = this.postList[index];
            var postData = { storeId: data.storeId };
            this.$confirm("确定要进行 " + data.storeName + " 审核通过 操作吗？")
                .then(() => review(postData))
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
            var postData = {
                storeId: data.storeId,
                remarks: "",
                storeStatus: 0
            };
            this.$confirm("确定要进行 " + data.storeName + " 启用 操作吗？")
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
            this.$confirm("是否确认导出?", "警告", {
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
    p {
        margin-bottom: 0;
    }
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
</style>
