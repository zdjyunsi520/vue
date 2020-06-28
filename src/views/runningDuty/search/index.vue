<template>
    <div class="app-container">
        <div class="search-box xl-querybox">
            <el-form :model="queryParams" ref="queryForm" :inline="true" class="xl-query" :rules="rules">
                <el-form-item label="用电单位：" prop="tenantId">
                    <el-select v-model="queryParams.tenantId">
                        <el-option label="请选择" value></el-option>
                        <el-option :key="item.key" :label="item.value" :value="item.key" v-for="item in companyType" />
                    </el-select>
                </el-form-item>
                <el-form-item label="值班人员：" prop="employeename">
                    <el-input v-model="queryParams.employeename" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="值班日期：" prop="starttime">
                    <el-date-picker v-model="queryParams.starttime" type="date" placeholder="请选择日期" clearable></el-date-picker>
                    至
                    <el-date-picker v-model="queryParams.endtime" type="date" placeholder="请选择日期" clearable></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
                    <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>

                </el-form-item>
                <!-- <el-button type="success" icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:user:edit']">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:user:remove']">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:user:export']">导出</el-button>-->
            </el-form>
        </div>
        <div class="bg-white containerbox" ref="containerbox">

            <div>
                <el-popover placement="bottom-end" class="floatright " popper-class='downloadpop' width="50px" trigger="hover" content="导出">
                    <el-button slot="reference" class="downloadbtn" @click="handleExport">
                        <svg-icon icon-class='ic_export' class="tablesvgicon"></svg-icon>
                    </el-button>
                </el-popover>
            </div>
            <el-table v-loading.fullscreen.lock="listLoading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" :data="dataList" border :height="tableHeight" style='margin-top:20px'>

                <template slot="empty">
                    <div class="nodata-box">
                        <img src="../../../assets/image/nodata.png" />
                        <p>暂时还没有数据</p>
                    </div>
                </template>
                <el-table-column label="上级单位" min-width='200' sortable prop="TenantName" />
                <el-table-column label="用电单位" min-width='200' sortable prop="ParentName" />
                <el-table-column label="值班人员" min-width='150' prop="EmployeeName" />
                <el-table-column label="值班班组" min-width='150' prop="DutyTeamName" />
                <el-table-column label="岗位" width='120' prop="PositionName" />
                <el-table-column label="值班开始时间" width='180' sortable prop="StartTime" />
                <el-table-column label="值班结束时间" width='180' sortable prop="EndTime" />
            </el-table>

            <pagination :total="total" :page.sync="queryParams.pageno" :limit.sync="queryParams.pagesize" @pagination="getList" />
        </div>
    </div>

</template>

<script>
import { mapGetters } from "vuex";
import { fetchList } from "@/api/runningDuty/search";

export default {
    name: "user",
    data() {
        return {
            // 遮罩层
            listLoading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 用户表格数据
            dataList: null,
            tableHeight: "calc(100% - 110px)",
            columnsExport: [
                "上级单位",
                "用电单位",
                "值班人员",
                "值班班组",
                "岗位",
                "值班开始时间",
                "值班结束时间"
            ],
            propTotal: [
                "TenantName",
                "ParentName",
                "EmployeeName",
                "DutyTeamName",
                "PositionName",
                "StartTime",
                "EndTime"
            ],
            rules: {},
            // 搜索参数
            queryParams: {
                pageno: 1,
                pagesize: 30,
                tenantId: "",
                starttime: "",
                endtime: "",
                employeename: "",
                teamId: ""
            }
        };
    },

    created() {
        this.getList();
    },
    computed: {
        ...mapGetters({
            companyType: "status/companyType"
        })
    },
    methods: {
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
        // 导出
        handleExport() {
            this.$confirm("是否确认导出表格吗?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.download();
            });
        },
        download() {
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = this.columnsExport;
                const list = this.dataList.slice(0);
                const data = this.formatJson(this.propTotal, list);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: "值班查询",
                    autoWidth: true,
                    bookType: "xlsx"
                });
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v =>
                filterVal.map(j => {
                    return v[j];
                })
            );
        }
    }
};
</script>
<style lang="scss">
</style>
