<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" class="xl-query">

            <el-form-item>
                <el-input placeholder="推广员ID" v-model="queryParams.exId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="推广员账号" v-model="queryParams.exAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询邀请的商家</el-button>
                <!-- <el-button v-hasPermi="['system:mer:info:excel']" :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleExport">导出</el-button> -->
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="商家ID" align="center" prop="id">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.id)">{{row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="手机号码" align="center" prop="merAccount" />
            <el-table-column label="QQ" align="center" prop="qq" />
            <!-- <el-table-column width="110px" label="本金" prop="mmerchantAccountInfo.usablePrincipal" />
      <el-table-column width="110px" label="佣金" align="center" prop="mmerchantAccountInfo.usableBrokerage" />
      <el-table-column label="今日放单" align="center" prop="mmerTaskOrder.orderQuantityToday" />
      <el-table-column label="昨日放单" align="center" prop="mmerTaskOrder.orderQuantityYesterday" />
      <el-table-column label="近7天放单" align="center" prop="mmerTaskOrder.nearlySevenDaysOrderQuantity" /> -->

            <el-table-column label="注册时间" align="center" prop="registerTime" />
            <!-- <el-table-column width="80px" label="推广员ID" prop="exId" /> 
      <el-table-column width="110px" label="推广员" prop="exAccountName" />-->
            <el-table-column label="状态" align="center" prop="state" :formatter="filterSeller" />
            <!-- <el-table-column label="停用原因" align="center" prop="node">
        <template slot-scope="{row}">
          {{row.state==3?row.node:''}}
        </template>
      </el-table-column> -->
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <detail ref="detail"></detail>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import { fetchList } from "@/api/promotor/childMerchant";
import area from "@/utils/area_data1";
import detail from "@/views/seller/detail";
const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);

const allKV = all.reduce((l, v) => {
    l[v.c] = v.a;
    return l;
}, {});

export default {
    name: "查询邀请商家",
    components: {
        detail
    },
    data() {
        return {
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
                exId: "",
                exAccount: ""
            }
        };
    },
    created() {},
    filters: {},
    watch: {},
    computed: {
        ...mapGetters({
            sellerType: "status/sellerType",
            deptType: "status/deptType"
        }),
        ...mapState(["common"]),
        sellerKV() {
            return this.sellerType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    methods: {
        filterSeller(row) {
            return this.sellerKV[row.state];
        },
        handleOpenDetail(id) {
            const target = this.$refs.detail;
            this.common.merId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },

        showReason(remark) {
            return remark == "";
        },

        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
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
            this.$confirm("是否确认导出所有岗位数据项?", "警告", {
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