<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:role:add']">新增</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="listLoading" :data="dataList" border>
            <el-table-column label="角色名称" align="center" prop="roleName" :show-overflow-tooltip="true" />
            <el-table-column label="权限字符" align="center" prop="roleKey" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:role:edit']">修改</el-button>
                    <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:role:remove']">删除</el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
    </div>
</template>

<script>
import { listRole, getRole, addRole, updateRole } from "@/api/system/role";
import update from "./components/update";
export default {
    components: { update },
    data() {
        return {
            // 遮罩层
            listLoading: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                roleName: undefined,
                roleKey: undefined,
                status: undefined
            },
            dataList: null
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询角色列表 */
        getList() {
            this.listLoading = true;
            listRole(this.addDateRange(this.queryParams, this.dateRange))
                .then(response => {
                    this.dataList = response.data;
                })
                .finally(r => (this.listLoading = false));
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },

        /** 新增按钮操作 */
        handleAdd() {
            const target = this.$refs.update;
            target.handleOpen();
            target.title = "添加";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            const target = this.$refs.update;
            target.handleOpen(row);
            target.title = "修改";
        }
    }
};
</script>