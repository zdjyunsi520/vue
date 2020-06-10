<template>
    <div class="comheight comflexbox">
        <div class="search-box xl-querybox">
            <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
                <el-form-item label="用电单位：" prop="tenantId">

                    <el-select v-model="queryParams.tenantId">
                        <el-option label="全部" value></el-option>
                        <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                    </el-select>

                </el-form-item>
                <el-form-item label="记事类型：" prop="type">
                    <el-select v-model="queryParams.type">
                        <el-option label="全部" value=""></el-option>
                        <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in recordType" />
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人：" prop="contactperson">
                    <el-input v-model="queryParams.contactperson" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="记事内容：" prop="recordcontent">
                    <el-input v-model="queryParams.recordcontent" placeholder="" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item label="记事日期：" prop="starttime">
                    <el-date-picker v-model="queryParams.starttime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
                    至
                    <el-date-picker v-model="queryParams.endtime" style='width: 47%;' type="date" placeholder="请选择日期" clearable></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                </el-form-item>
                <el-form-item>
                </el-form-item>
            </el-form>
        </div>
        <div class="bg-white containerbox " ref="containerbox" >
            <el-table v-loading="listLoading" :data="dataList" @selection-change="handleSelectionChange" border :height="height" @sort-change="handleSortChange"  style='margin-top:15px;'>
                <template slot="empty">
                    <div class="nodata-box">
                        <img src="@/assets/image/nodata.png" />
                        <p>暂时还没有数据</p>
                    </div>
                </template>
                <!-- <el-table-column type="selection" fixed="left" width="55" /> -->
                <el-table-column label="起始时间" width='180' prop="StartTime" />
                <el-table-column label="完成时间"  width='180' prop="EndTime" />
                <el-table-column label="用电单位" min-width='230'  prop="TenantName" />
                <el-table-column label="联系人" width='120' prop="ContactPerson" />
                <el-table-column label="联系电话" width='140' prop="PhoneNo" />
                <el-table-column label="记事类型" width='130' prop="Type" :formatter="filterType" />
                <el-table-column label="记事内容" min-width='140' prop="RecordContent" />
                <el-table-column label="记事时间" width='180' prop="UpdateTime" />
                <el-table-column label="导入下一班" width='120' prop="IsSucceed" :formatter="filterIsSucceed" />
            </el-table>
            <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, deleted } from "@/api/runningDuty/record/dutyRecord";
export default {
    name: "user",
    data() {
        return {
            // 遮罩层
            listLoading: true,
            // 选中数组
            ids: [],
            // 总条数
            total: 0,
            // 用户表格数据
            dataList: null,
            height: "calc(100% - 80px)",
            rules: {},
            // 搜索参数
            queryParams: {
                pageno: 1,
                pagesize: 30,
                tenantId: "",
                contactperson: "",
                recordcontent: "",
                starttime: "",
                endtime: "",
                type: ""
            }
        };
    },

    created() {},
    computed: {
        ...mapGetters({
            companyType: "status/companyType",
            recordType: "status/recordType",
            recordKV: "status/recordKV"
        }),
        single() {
            return this.ids.length != 1;
        },
        multiple() {
            return this.ids.length == 0;
        }
    },
    methods: {
        filterType(row) {
            return this.recordKV[row.Type];
        },
        filterIsSucceed(row) {
            return row.IsSucceed ? "是" : "否";
        },
       
        handleSortChange(row) {
            this.queryParams.orderby = `${row.prop} ${
                row.order == "ascending" ? "asc" : "desc"
            }`;
            this.getList();
        },
        /** 搜索用户列表 */
        getList() {
            this.listLoading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.dataList = response.data;
                    this.total = response.total;
                })
                .finally(r => {
                    this.listLoading = false;
                });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageno = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection;
        },

        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有用户数据项？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(function() {
                    return exportUser(queryParams);
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
</style>
