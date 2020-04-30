<template>
    <div class="app-container">
        <el-row class="xl-text-align">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:add']">新增</el-button>
        </el-row>
        <el-table border v-loading="loading" :data="deptList" row-key="deptId" default-expand-all :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="deptId" align="center" label="分站ID" />
            <el-table-column prop="orderNum" align="center" label="排序" />
            <el-table-column prop="deptName" align="center" label="分站名称" />
            <el-table-column label="联系电话" align="center" prop="phone" />
            <el-table-column label="后台域名" align="center" prop="backSideServerName" />
            <el-table-column label="商家域名" align="center" prop="merSideServerName" />
            <el-table-column label="推广员域名" align="center" prop="exSideServerName" />
            <el-table-column label="LOGO图片" align="center">
                <template slot-scope="{ row }">
                    <img :src="path + row.deptLogo + process" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="短信模板标题" align="center" prop="labelName" />
            <el-table-column label="操作" align="center" width="160px">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="warning" @click="handleUpdate(scope.row)" v-hasPermi="['system:dept:edit']">修改</el-button> -->
                    <el-button v-hasPermi="['system:dept:edit']" size="mini" type="warning" @click="handleUpdate(scope.row)">修改</el-button>
                    <el-button v-hasPermi="['system:dept:remove']" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <add ref="add" @getList="handleQuery"></add>
    </div>
</template>

<script>
import {
    listDept,
    getDept,
    treeselect,
    delDept,
    addDept,
    updateDept
} from "@/api/system/dept";
import add from "./components/add";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { mapGetters } from "vuex";
export default {
    components: { Treeselect, add },
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
            form: {},
            process: "?x-oss-process=image/resize,h_50"
        };
    },
    computed: {
        ...mapGetters({ path: "imgOSS/path" })
    },
    created() {
        this.getList();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
    },
    methods: {
        /** 查询分站列表 */
        getList() {
            this.loading = true;
            listDept(this.queryParams).then(response => {
                this.deptList = response.data;
                this.loading = false;
            });
        },
        /** 查询分站下拉树结构 */
        getTreeselect() {
            treeselect().then(response => {
                this.deptOptions = response.data;
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
        /** 新增按钮操作 */
        handleAdd() {
            var target = this.$refs.add;
            target.reset();
            target.show = false;
            target.open = true;
            target.title = "添加分站";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            var target = this.$refs.add;
            target.reset();
            Object.assign(target.form, row);
            if (row.deptLogo) {
                target.show = true;
            } else {
                target.show = false;
            }
            target.open = true;
            target.title = "修改分站";
        },

        /** 删除按钮操作 */
        handleDelete(row) {
            this.$confirm(
                '是否确认删除名称为"' + row.deptName + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return delDept(row.deptId);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
        }
    }
};
</script>
