<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" label-width="120px">
            <el-form-item>
                <el-date-picker :editable="false" v-model="listQuery.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="选择结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-date-picker :editable="false" v-model="listQuery.startingTime" default-time="00:00:00" align="right" type="datetime" placeholder="选择起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="listQuery.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="选择结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="是否限制接单" value="" />
                    <el-option label="限制" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="登录账户状态" value="" />
                    <el-option label="正常" :value="0" />
                    <el-option label="禁用" :value="1" />
                    <el-option label="黑名单" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="账号质量状态" value="" />
                    <el-option label="未申请" :value="0" />
                    <el-option label="未审核" :value="1" />
                    <el-option label="普通账号" :value="2" />
                    <el-option label="优质账号" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="买号类型" value="" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="买手账号状态" value="" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="queryParams.auditState">
                    <el-option label="旺旺号拉黑" value="" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.buyerAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="买手账号" v-model="queryParams.jdAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="买手ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="listLoading" :data="postList" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" width="55" align="center" /> -->
            <el-table-column label="优质" align="center" prop="isHighQuality">
                <template slot-scope="{row}">
                    <span>{{row.isHighQuality|filterExcellent}}</span>
                </template>
            </el-table-column>
            <el-table-column label="买手ID" align="center" prop="id" />
            <el-table-column label="手机号码" align="center" prop="buyerAccount" />
            <el-table-column label="京东账号" align="center" prop="jdAccount" />
            <el-table-column label="收货人资料" align="center">
                <template slot-scope="{row}">
                    <ul>
                        <li>{{row.name}}</li>
                        <li>{{row.phone}}</li>
                        <li>{{row.isSexType | filterGender}}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="收货人地址" align="center" prop="createTime">
                <template slot-scope="{row}">
                    <ul>
                        <li>{{row.province|filterAddress}}</li>
                        <li>{{row.city|filterAddress}}</li>
                        <li>{{row.district|filterAddress}}</li>
                        <li>{{row.address}}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="账号用户名" align="center" prop="createTime" />
            <el-table-column label="京东实名认证" align="center" prop="realNameUrl" />
            <el-table-column label="账号等级" align="center" prop="levUrl" />
            <el-table-column label="京东白条" align="center" prop="jdWhiteUrl" />
            <el-table-column label="绑定时间" align="center" prop="bindTime" />
            <el-table-column label="审核时间/状态" align="center">
                <template slot-scope="{row}">
                    <ul>
                        <li>{{row.auditState}}</li>
                        <li>{{row.auditName}}</li>
                        <li>{{row.auditTime}}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column label="审核理由" align="center">
                <template slot-scope="{row}">
                    <el-select v-model="row.remark" v-if="row.auditState==0">

                        <el-option v-for="item in reason" :key="item.title" :label="item.title" :value="item.title"></el-option>
                    </el-select>
                    <div v-else>{{row.remark}}</div>
                </template>
            </el-table-column>
            <el-table-column width="200px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}" class="xl-table-column">
                    <div v-if="row.auditState==0">
                        <el-row>
                            <el-button type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,1)">审核优质</el-button>
                        </el-row>
                        <el-row>
                            <el-button type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,0)">审核普通</el-button>
                        </el-row>
                        <el-row>
                            <el-button type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,2)">审核驳回</el-button>
                        </el-row>
                        <el-row>
                            <el-button type="danger" :loading="loading" size="small" icon="el-icon-delete" @click="handleReview($index,3)">旺旺拉黑</el-button>
                        </el-row>
                    </div>
                    <div v-else>
                        <el-button type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleReview($index,1)">修改</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import { fetchList, block } from "@/api/buyer";
import area from "@/utils/area_data1";

const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);

const allKV = all.map((l, v) => {
    l[v.c] = v.a;
    return l;
}, {});

const excellentKV = {
    0: "",
    1: "优"
};

const genderKeyValue = {
    0: "男",
    1: "女"
};
const status = [
    { id: 0, title: "未审核" },
    { id: 1, title: "未确认" },
    { id: 2, title: "已确认" },
    { id: 3, title: "已驳回" }
];
const reason = [
    { id: 0, title: "无" },
    { id: 1, title: "账号用户名截图错误" },
    { id: 2, title: "京东实名认证截图错误" },
    { id: 3, title: "账号等级截图错误" },
    { id: 4, title: "京东白条截图错误" },
    { id: 5, title: "京东账号不符合要求" },
    { id: 6, title: "照妖镜存在跑单记录" },
    {
        id: 7,
        title:
            "此账号不符合平台绑定要求，不要再申请这个账号绑定，一样会被驳回。请更换其他账号进行审核绑定，请更换其他没有被删除评价的账号进行绑定审核即可，无需联系客服咨询，结果是一样的。"
    }
];
const statusKeyValue = status.reduce((l, v) => {
    l[v.id] = v.title;
    return l;
}, {});
export default {
    data() {
        return {
            reason,
            status,
            // 遮罩层
            loading: false,
            listLoading: false,
            review: {
                title: [
                    "审核普通账号",
                    "审核优质账号",
                    "审核回驳",
                    "旺旺号拉黑"
                ],
                fn: [excellent, excellent, refuse, block],
                data: null
            },
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 状态数据字典
            statusOptions: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                merId: "",
                auditState: "",
                buyerAccount: "",
                jdAccount: "",
                id: ""
            },
            // 表单参数
            form: {}
            // 表单校验
        };
    },
    created() {
        this.getList();
        this.getDicts("sys_normal_disable").then(response => {
            this.statusOptions = response.data;
        });
    },
    filters: {
        filterGender(gender) {
            return genderKeyValue[gender];
        },
        filterStatus(status) {
            return statusKeyValue[status];
        },
        filterAddress(code) {
            return allKV[code];
        },
        filterExcellent(type) {
            return excellentKV[type];
        }
    },
    methods: {
        showReason(remark) {
            return remark == "";
        },
        handleReview(index, sts) {
            this.loading = true;
            var data = this.postList[index];
            this.$confirm(
                "确定要进行 " +
                    data.jdAccount +
                    " " +
                    this.review.title[sts] +
                    " 操作吗？"
            )
                .then(r => {
                    var d;
                    if (sts < 2) {
                        d = { id: data.id, isHighQuality: sts };
                    } else {
                        d = { id: data.id, note: data.remark };
                    }
                    this.review.fn[sts](d)
                        .then(r => {
                            Object.assign(data, d);
                            this.$message.success(r.data.msg);
                        })
                        .finally(e => {
                            this.loading = false;
                        });
                })
                .catch(r => {
                    this.loading = false;
                });
        },
        /** 查询岗位列表 */
        getList() {
            this.listLoading = true;
            fetchList(this.queryParams)
                .then(response => {
                    this.postList = response.list;
                    this.total = response.total;
                })
                .finally(e => {
                    this.listLoading = false;
                });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
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
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.postId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加岗位";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const postId = row.postId || this.ids;
            getPost(postId).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改岗位";
            });
        },
        /** 提交按钮 */
        submitForm: function() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.postId != undefined) {
                        updatePost(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("修改成功");
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    } else {
                        addPost(this.form).then(response => {
                            if (response.code === 200) {
                                this.msgSuccess("新增成功");
                                this.open = false;
                                this.getList();
                            } else {
                                this.msgError(response.msg);
                            }
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const postIds = row.postId || this.ids;
            this.$confirm(
                '是否确认删除岗位编号为"' + postIds + '"的数据项?',
                "警告",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(function() {
                    return delPost(postIds);
                })
                .then(() => {
                    this.getList();
                    this.msgSuccess("删除成功");
                })
                .catch(function() {});
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