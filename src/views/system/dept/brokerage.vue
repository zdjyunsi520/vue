<template>
    <div class="app-container">
        <el-table border v-loading="loading" :data="deptList">
            <el-table-column prop="deptId" align="center" label="分站ID" />
            <!-- <el-table-column prop="orderNum" align="center" label="排序" /> -->
            <el-table-column prop="deptName" align="center" label="分站名称" />

            <el-table-column label="分站佣金比例" align="center" prop="deptCommisionRate" />
            <el-table-column label="刷手上上上级佣金比例" align="center" prop="highestBuyerCommissionRate" />
            <el-table-column label="刷手上上级佣金比例" align="center" prop="firstBuyerCommissionRate" />
            <el-table-column label="刷手上级佣金比例" align="center" prop="secondaryBuyerCommissionRate" />
            <el-table-column label="刷手佣金比例" align="center" prop="buyerCommissionRate" />
            <el-table-column label="空包邮费加价" align="center" prop="envelopeFee" />
            <el-table-column label="打标签费用加价" align="center" prop="labelFee" />
            <el-table-column label="照妖镜费用加价" align="center" prop="mirrorFee" />
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="warning" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button> -->
                    <el-button size="mini" type="warning" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <updateBrokerage ref="updateBrokerage"></updateBrokerage>
    </div>
</template>

<script>
import { fetchExList as fetchList } from "@/api/system/dept";
import updateBrokerage from "./components/updateBrokerage";

export default {
    components: { updateBrokerage },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 表格树数据
            deptList: [],
            // 分站树选项
            deptOptions: undefined,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            // 查询参数
            queryParams: {},
            // 表单参数
            form: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询分站列表 */
        getList() {
            this.loading = true;
            fetchList(this.queryParams).then(response => {
                this.deptList = response.data.list;
                this.loading = false;
            });
        },

        // 字典状态字典翻译
        statusFormat(row, column) {
            return this.selectDictLabel(this.statusOptions, row.status);
        },

        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },

        /** 修改按钮操作 */
        handleUpdate(row) {
            var target = this.$refs.updateBrokerage;
            target.form = row;
            target.open = true;
            target.title = "修改分站--推广员端";
        }
    }
};
</script>
