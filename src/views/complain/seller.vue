<template>
    <div class="app-container">
        <el-form class="xl-query" :model="queryParams" ref="queryForm" :inline="true" label-width="120px">

            <el-select v-model="queryParams.status" clearable>
                <el-option label="申诉状态" value="" />
                <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in complainType" />

            </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.type" clearable>
                    <el-option label="申诉类型" value="" />
                    <el-option :key="item.value" :label="item.value" :value="item.key" v-for="item in complainContentType" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.taskTypeId" clearable>
                    <el-option label="任务类型" value="" />
                    <el-option :key="item.taskName" :label="item.taskName" :value="item.id" v-for="item in orderList" />
                </el-select>
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="订单编号" v-model="queryParams.orderNo" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="买手ID" v-model="queryParams.buyerId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item prop="postCode">
                <el-input placeholder="商家ID" v-model="queryParams.merId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>

            <el-form-item>
                <el-date-picker :editable="false" placeholder="申诉时间" v-model="queryParams.createDate" align="right" type="date"></el-date-picker>
            </el-form-item>

            <!-- <el-form-item prop="status">
        <el-select v-model="queryParams.dept_id" clearable size="small">
          <el-option label="所属站点" value="" />
          <el-option :key="item.deptName" :label="item.deptName" :value="item.dept_id" v-for="item in deptType" />
        </el-select>
      </el-form-item> -->

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="postList" border>
            <!-- <el-table-column type="selection" width="55" align="center"  />  :formatter="" -->
            <el-table-column label="申诉进程" align="center" prop="status" :formatter="filterComplain" />
            <el-table-column label="申诉时间" align="center" prop="createTime" width="95px" />
            <el-table-column label="申诉类型" width="130px" align="center" prop="type" :formatter="filterComplainContent" />

            <el-table-column label="订单编号" align="center" prop="orderNo" />

            <el-table-column label="申诉图片" align="center" prop="evidenceImgUrlFirst">
                <template slot-scope="{row,$index}">
                    <el-row class="xl-row-img">
                        <img @click="handleShow(row.evidenceImgUrlFirst)" :src="path+row.evidenceImgUrlFirst+process" alt="">
                        <img @click="handleShow(row.evidenceImgUrlSecondly)" :src="path+row.evidenceImgUrlSecondly+process" alt="">
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="申诉内容" align="center" prop="appealContent" />
            <el-table-column label="商家ID" align="center" prop="merId" />
            <el-table-column label="买手ID" align="center" prop="buyerId" />
            <el-table-column label="任务类型" align="center" prop="taskTypeName" />

            <el-table-column label="处理信息" align="center" prop="replyContent" />
            <el-table-column width=" 100px" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <el-row>
                        <el-button v-hasPermi="['system:merchant:appeal:confirm']" v-if="row.status==1" type="success" :loading="loading" size="mini" @click="handlePass('pass',row,1)">审核通过</el-button>
                    </el-row>
                    <el-row>
                        <el-button v-hasPermi="['system:merchant:appeal:refuse']" v-if="row.status==1" type="danger" :loading="loading" size="mini" @click="handlePass('pass',row,0)">审核拒绝</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <show-image ref="showImage"></show-image>
        <passComponents ref="pass" @getList="getList"></passComponents>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { fetchList, pass, refuse } from "@/api/complain/seller";
import { dateFortmat } from "@/utils";
import showImage from "@/components/showImage";
import passComponents from "./components/pass";
export default {
    name: "商家申诉",
    components: { showImage, passComponents },
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            deptList: null,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            process: "?x-oss-process=image/resize,h_60",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                buyerId: "",
                createDate: "",
                deptId: "",
                merId: "",
                orderNo: "",
                status: "",
                taskTypeId: "",
                type: ""
            }
        };
    },
    created() {
        this.getList();
    },
    computed: {
        ...mapGetters({
            deptType: "status/deptType",
            orderType: "status/orderType",
            orderKV: "status/orderKV",
            complainType: "status/complainType",
            complainKV: "status/complainKV",
            complainContentType: "status/complainContentType",
            complainContentKV: "status/complainContentKV",
            path: "imgOSS/path"
        }),
        orderList() {
            return this.orderType
                ? this.orderType.filter(v => v.fId > 0)
                : null;
        },
        deptKV() {
            if (this.deptType) {
                return this.deptType.reduce((l, v) => {
                    l[v.dept_id] = v.deptName;
                    return l;
                }, {});
            } else {
                return {};
            }
        }
    },
    watch: {},
    methods: {
        handleShow(url) {
            this.$refs.showImage.url = url;
            this.$refs.showImage.dialogVisible = true;
        },
        filterDept(row) {
            return this.deptKV[row.dept_id];
        },
        filterComplain(row) {
            return this.complainKV[row.status];
        },
        filterComplainContent(row) {
            return this.complainContentKV[row.type];
        },
        filterTime() {
            if (
                this.queryParams.createDate &&
                this.queryParams.createDate.length != 10
            ) {
                this.queryParams.createDate = dateFortmat(
                    this.queryParams.createDate,
                    "yyyy-MM-dd"
                );
            }
        },
        handlePass(refName, f, sts) {
            var target = this.$refs[refName];
            target.reset();
            const id = f.appealNo;
            target.list = [id];
            if (sts) {
                target.title = "审核通过";
                target.operate = pass;
            } else {
                target.title = "审核拒绝";
                target.operate = refuse;
            }
            target.dialogVisible = true;
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
.xl-row-img {
    img {
        width: 50px;
        height: 50px;
        cursor: pointer;
    }
}
</style>