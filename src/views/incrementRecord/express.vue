<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">

            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startTime" default-time="00:00:00" align="right" type="datetime" placeholder="选择起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="选择结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家账号" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="第三方单号" v-model="queryParams.mallOrderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="面单号/快递单号" v-model="queryParams.waybillNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.platformType">
                    <el-option label="平台类型" value="" />
                    <el-option v-for="item in platformType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.expressType">
                    <el-option label="空包类型" value="" />
                    <el-option v-for="item in expressType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.logiType">
                    <el-option label="快递类型" value="" />
                    <el-option v-for="item in logiType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.useType">
                    <el-option label="使用类型" value="" />
                    <el-option v-for="item in useType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.isError">
                    <el-option label="获取状态" value="" />
                    <el-option v-for="item in errorType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.deptId">
                    <el-option label="所属站点" value="" />
                    <el-option v-for="item in deptType" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <!-- <el-button
          :loading="loading"
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:buyer:info:excel']"
          >导出</el-button
        > -->
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="所属站点" align="center" prop="deptName" />
            <el-table-column label="商家ID" align="center" prop="merId" />
            <el-table-column label="手机号" align="center" prop="merAccount" width="110px" />
            <el-table-column label="平台类型" align="center" prop="platformType" :formatter="filterPlatform" />
            <el-table-column label="空包类型" align="center" prop="expressType" :formatter="filterExpress" />
            <el-table-column label="快递单号" align="center" prop="waybillNo" width="140px" />
            <el-table-column label="第三方单号" align="center" prop="mallOrderNo" />
            <el-table-column label="快递类型" align="center" prop="logiType" :formatter="filterLogi" />
            <el-table-column label="使用类型" align="center" prop="useType" :formatter="filterUse" />
            <el-table-column label="购买时间" align="center" prop="createTime" width="160px" />
            <el-table-column label="收货人" align="center" prop="consigneeName" />
            <el-table-column label="价格" align="center" prop="money" />
            <el-table-column label="备注" align="center" prop="remark" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { dateFortmat } from "@/utils";
import { express as fetchList } from "@/api/incrementRecord";
import { mapState, mapGetters } from "vuex";

const platformType = [
    { key: 1, value: "淘宝" },
    { key: 2, value: "拼多多" },
    { key: 3, value: "京东" },
    { key: 4, value: "苏宁" }
];
const platformKV = platformType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});

const expressType = [
    { key: 1, value: "空包" },
    { key: 2, value: "信封" }
];
const expressKV = expressType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});

const logiType = [
    { key: 1, value: "百世" },
    { key: 2, value: "圆通" },
    { key: 4, value: "韵达" }
];
const logiKV = logiType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});

const errorType = [
    { key: 0, value: "成功" },
    { key: 1, value: "失败" }
];
const errorKV = errorType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});

const useType = [
    { key: 1, value: "订单使用" },
    { key: 2, value: "非订单使用" }
];
const useKV = useType.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
}, {});
export default {
    name: "空包记录",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            platformType,
            platformKV,
            expressType,
            expressKV,
            errorType,
            errorKV,
            useType,
            useKV,
            logiType,
            logiKV,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deptId: "",
                startTime: "",
                endTime: "",
                merAccount: "",
                merId: "",
                expressType: "",
                isError: "",
                logiType: "",
                mallOrderNo: "",
                platformType: "",
                useType: "",
                waybillNo: ""
            }
        };
    },
    computed: {
        ...mapGetters({ deptType: "status/deptType" })
    },
    created() {
        this.getList();
    },
    methods: {
        filterPlatform(row) {
            return this.platformKV[row.platformType];
        },
        filterLogi(row) {
            return this.logiKV[row.logiType];
        },
        filterExpress(row) {
            return this.expressKV[row.expressType];
        },
        filterUse(row) {
            return this.useKV[row.useType];
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
    /deep/.el-select-dropdown__list {
        width: 180px;
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
</style>
