<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" label-width="120px">

            <el-form-item>
                <el-select v-model="queryParams.userType">
                    <el-option label="用户类型" value="" />
                    <el-option label="分站" :value="1" />
                    <el-option label="推广员" :value="2" />
                    <el-option label="买手" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="用户ID" v-model="queryParams.userId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startTime" default-time="00:00:00" align="right" type="datetime" placeholder="操作起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="操作结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <!-- <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">导出</el-button> -->
            </el-form-item>
        </el-form>

        <el-table v-loading="listLoading" :data="postList">
            <el-table-column label="用户类型" align="center" prop="userId">
                <template slot-scope="{row}">
                    {{row.userType==1?'分站':row.userType==2?'推广员':row.userType==3?'买手':''}}
                </template>
            </el-table-column>
            <el-table-column label="用户ID" align="center" prop="userId" />
            <el-table-column label="用户账号" align="center" prop="userAccount" />
            <el-table-column label="原佣金比例" align="center" prop="originalRate" />
            <el-table-column label="修改后佣金比例" align="center" prop="currentRate" />
            <el-table-column label="修改人ID" align="center" prop="operatorId" />
            <el-table-column label="修改人账号" align="center" prop="operatorAccount" />
            <el-table-column label="操作时间" align="center" prop="createTime" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { fetchList } from "@/api/system/commisionRate";
import { dateFortmat } from "@/utils";
export default {
    name: "佣金比例修改记录",
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
                userType: "",
                startTime: "",
                endTime: "",
                userId: ""
            },
            // 表单参数
            form: {}
            // 表单校验
        };
    },
    created() {
        this.getList();
    },
    methods: {
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
                .then(({ data }) => {
                    this.postList = data.list;
                    this.total = data.total;
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
        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有岗位数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return exportPost(queryParams);
                })
                .then(response => {
                    this.download(response.msg);
                })
                .catch(function() {});
        }
    }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
    margin-bottom: 0;
}
.pagination-center {
    text-align: center;
    margin-bottom: 50px;
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
/deep/.cell {
    text-align: center;
}
/deep/.xl-table-column {
    .el-button--mini {
        color: #eee;
    }
}
</style>