<template>
    <el-row>
        <el-table :data="tableData" border>
            <el-table-column prop="taskPlatformName" label="平台" />
            <el-table-column prop="storeName" label="店铺名称" />
            <el-table-column prop="storeAccountId" label="旺旺ID" />
            <el-table-column prop="phone" label="店铺电话" />
            <el-table-column label="店铺地址">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.storeHomeUrl, $event)">复制链接</el-button>

                </template>
            </el-table-column>
            <el-table-column prop="province" label="省">
                <template slot-scope="{row}">
                    {{filterAll(row.province)}}
                </template>
            </el-table-column>
            <el-table-column prop="city" label="市">
                <template slot-scope="{row}">
                    {{filterAll(row.city)}}
                </template>
            </el-table-column>
            <el-table-column prop="district" label="区/县">
                <template slot-scope="{row}">
                    {{filterAll(row.district)}}
                </template>
            </el-table-column>
            <el-table-column prop="storeState" label="状态" :formatter="filterSeller" />
            <el-table-column width="160px" prop="createTime" label="绑定时间" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </el-row>
</template>

<script>
import { fetchStore as fetchInfo } from "@/api/seller";
import { mapState, mapGetters } from "vuex";
import handleClipboard from "@/utils/clipboard";
export default {
    data() {
        return {
            tableData: null,
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                merId: ""
            },
            total: 0
        };
    },

    computed: {
        ...mapState(["common"]),
        ...mapGetters({ allKV: "area/allKV", sellerKV: "status/sellerKV" })
    },

    methods: {
        handleClipboard,
        filterAll(id) {
            return this.allKV[id];
        },
        filterSeller(row) {
            return this.sellerKV[row.storeState];
        },
        getList() {
            this.queryParams.merId = this.common.merId;
            fetchInfo(this.queryParams).then(({ data }) => {
                this.tableData = data.list;
                this.total = data.total;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.el-row {
    font-size: 14px;
}
.xl-main-pic {
    img {
        width: 100%;
        height: 100%;
    }
}
.xl-mian-header-top {
    & > .el-col {
        background: #d8dde5;
        color: #040404;
        padding: 10px 20px;
    }
}
.xl-main-center {
    text-align: center;
}
.xl-mian-header {
    & > .el-col {
        margin-top: 60px;
        text-align: center;
    }
    .xl-main-first {
        margin-top: 0;
        text-align: left;
    }
}
.xl-main-link {
    overflow: hidden;
    height: 100%;
    white-space: nowrap;
    word-break: break-word;
}
.xl-main-text {
    .el-row {
        margin: 5% 10px;
    }
}
span {
    color: #0098e1;
}
.xl-task-row {
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
}
.xl-img-row {
    margin: 20px;
}
</style>