<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" label-width="120px" class="xl-query">

            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startTime" default-time="00:00:00" align="right" type="datetime" placeholder="选择起始日期"></el-date-picker>
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
                <el-input placeholder="商家账号" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="旺旺号" v-model="queryParams.wantWant" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.tagType">
                    <el-option label="打标类型" value="" />
                    <el-option v-for="item in tagType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-select v-model="queryParams.useType">
                    <el-option label="使用类型" value="" />
                    <el-option v-for="item in useType" :label="item.value" :value="item.key" />
                </el-select>
            </el-form-item>

            <!-- 
        <el-form-item>
        <el-select v-model="queryParams.deptId">
          <el-option label="所属站点" value="" />
          <el-option v-for="item in deptType" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item> -->
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
            <el-table-column label="打标类型" align="center" prop="tagType" :formatter="filterTag" />
            <el-table-column label="商品链接" align="center" prop="tagProductLink">
                <template slot-scope="{ row }">
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, row.tagProductLink, $event)">复制链接</el-button>
                    <!-- <a class="link-type" target="_blank" :href="row.tagProductLink">{{ row.tagProductLink }}</a> -->
                </template>
            </el-table-column>
            <el-table-column label="旺旺号" align="center" prop="tagWantWant" />
            <el-table-column label="使用类型" align="center" prop="useType" :formatter="filterUse" />
            <el-table-column label="购买时间" align="center" prop="tagTime" width="160px" />
            <el-table-column label="价格" align="center" prop="tagMoney" />
            <el-table-column label="备注" align="center" prop="tagRemarks" />
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { dateFortmat } from "@/utils";
import { marking as fetchList } from "@/api/incrementRecord";
import { mapState, mapGetters } from "vuex";
import handleClipboard from "@/utils/clipboard";
const tagType = [
    { key: 1, value: "单个" },
    { key: 2, value: "多个" }
];
const tagKV = tagType.reduce((l, v) => {
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
    name: "打标记录",
    components: {},
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            tagType,
            tagKV,
            useType,
            useKV,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                merAccount: "",
                startTime: "",
                endTime: "",
                merId: "",
                tagType: "",
                useType: "",
                wantWant: ""
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
        handleClipboard,
        filterTag(row) {
            return this.tagKV[row.tagType];
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
.link-type {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
</style>
