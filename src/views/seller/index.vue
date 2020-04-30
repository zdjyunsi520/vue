<template>
    <div class="app-container">
        <el-form ref="queryForm" :inline="true" class="xl-query">
            <!-- <el-form-item label="最后登录时间">
        <el-date-picker :editable="false" v-model="queryParams.startTime" type="date" placeholder="选择日期">
        </el-date-picker>
      </el-form-item> -->
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.startingTime" default-time="00:00:00" align="right" type="datetime" placeholder="注册起始日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker :editable="false" v-model="queryParams.endTime" default-time="23:59:59" align="right" type="datetime" placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <!-- <el-form-item>
        <el-select v-model="state">
          <el-option label="是否支付" value="" />
          <el-option v-for="item in status" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item> -->
            <el-form-item>
                <el-select v-model="queryParams.deptId" clearable>
                    <el-option label="所属站点" value="" />
                    <el-option v-for="item in deptType" :label="item.deptName" :value="item.deptId" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="推广员ID" v-model="queryParams.exId" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="手机号码" v-model="queryParams.merAccount" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="QQ" v-model="queryParams.qq" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-input placeholder="商家ID" v-model="queryParams.id" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-hasPermi="['system:mer:info:excel']" :loading="loading" type="primary" icon="el-icon-search" size="mini" @click="handleExport">导出</el-button>
            </el-form-item>
            <el-form-item>
                <el-button v-hasPermi="['system:mer:msg']" :loading="loading" type="success" icon="el-icon-add" size="mini" @click="handleSend(null)">批量发送站内信</el-button>
            </el-form-item>
        </el-form>

        <el-table border v-loading="listLoading" :data="postList" @selection-change="handleSelection">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column width="80px" label="商家ID" align="center" prop="id">
                <template slot-scope="{row}">
                    <span class="link-type" @click="handleOpenDetail(row.id)">{{row.id}}</span>
                </template>
            </el-table-column>
            <el-table-column width="80px" label="所属站点" align="center" prop="deptName" />
            <el-table-column width="110px" label="手机号码" align="center" prop="merAccount" />
            <el-table-column width="110px" label="QQ" align="center" prop="qq" />
            <el-table-column width="110px" label="本金" prop="mmerchantAccountInfo.usablePrincipal" />
            <el-table-column width="110px" label="佣金" align="center" prop="mmerchantAccountInfo.usableBrokerage" />
            <el-table-column label="今日放单" align="center" prop="mmerTaskOrder.orderQuantityToday" />
            <el-table-column label="昨日放单" align="center" prop="mmerTaskOrder.orderQuantityYesterday" />
            <el-table-column label="近7天放单" align="center" prop="mmerTaskOrder.nearlySevenDaysOrderQuantity" />

            <el-table-column width="95px" label="注册时间" align="center" prop="registerTime" />
            <el-table-column width="95px" label="登录时间" align="center" prop="lastLoginTime" />
            <el-table-column width="80px" label="推广员ID" prop="exId" />
            <el-table-column width="110px" label="推广员" prop="exAccountName" />
            <el-table-column width="60px" label="状态" align="center" prop="state" :formatter="filterSeller" />
            <el-table-column label="停用原因" align="center" prop="node">
                <template slot-scope="{row}">
                    {{row.state!=1&&row.node?row.node:''}}
                </template>
            </el-table-column>
            <el-table-column width="200px" label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="{row,$index}">
                    <el-button v-hasPermi="['system:mer:info:update']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('update',$index)">修改</el-button>
                    <el-button v-hasPermi="['system:mer:info:promoter']" type="primary" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('updateExtension',$index)">修改推广员</el-button>
                    <el-button v-hasPermi="['system:mer:info:disable']" v-if="row.state==1" type="danger" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts',$index,0)">禁用</el-button>
                    <el-button v-hasPermi="['system:mer:info:disable']" v-else type="success" :loading="loading" size="small" icon="el-icon-edit" @click="handleOpen('setSts',$index,0)">启用</el-button>
                    <el-button v-hasPermi="['system:mer:msg']" type="warning" :loading="loading" size="small" icon="el-icon-edit" @click="handleSend(row.merAccount)">发送站内信</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <update ref="update" @getList="getList"></update>
        <set-sts ref="setSts" @getList="getList"></set-sts>
        <detail ref="detail"></detail>
        <updateExtension ref="updateExtension" @getList="getList"></updateExtension>
        <send-letter ref="sendLetter"></send-letter>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { dateFortmat } from "@/utils";
import { fetchList, disabled, exportExcel, special } from "@/api/seller";
import update from "./components/update";
import updateExtension from "./components/updateExtension";
import setSts from "./components/setSts";
import sendLetter from "./components/sendLetter";
import area from "@/utils/area_data1";
import detail from "./detail";
const all = JSON.parse(area);
// const province = all.filter(v => v.l == 1);
// const city = all.filter(v => v.l == 2);
// const region = all.filter(v => v.l == 3);

const allKV = all.reduce((l, v) => {
    l[v.c] = v.a;
    return l;
}, {});

export default {
    name: "商家信息",
    components: {
        update,
        setSts,
        detail,
        sendLetter,
        updateExtension
    },
    data() {
        return {
            // 遮罩层
            loading: false,
            listLoading: false,
            review: {
                title: ["启用", "禁用"],
                fn: [disabled, disabled],
                data: null
            },
            // 总条数
            total: 0,
            // 岗位表格数据
            postList: [],

            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                exId: "",
                id: "",
                qq: "",
                startingTime: "",
                deptId: "",
                endTime: ""
            },
            merAccountList: []
        };
    },
    created() {
        this.getList();
        this.common.merId = -1;
    },
    filters: {},
    watch: {},
    computed: {
        ...mapGetters({
            sellerType: "status/sellerType",
            deptType: "status/deptType"
        }),
        ...mapState(["common"]),
        sellerKV() {
            return this.sellerType.reduce((l, v) => {
                l[v.key] = v.value;
                return l;
            }, {});
        }
    },
    methods: {
        handleSelection(list) {
            this.merAccountList = list;
        },
        handleOpenDetail(id) {
            const target = this.$refs.detail;
            this.common.merId = id;
            target.visible = true;
            target.initOne({ index: "0" });
        },
        filterSeller(row) {
            return this.sellerKV[row.state];
        },
        filterTime() {
            if (
                this.queryParams.startingTime &&
                this.queryParams.startingTime.length != 19
            ) {
                this.queryParams.startingTime = dateFortmat(
                    this.queryParams.startingTime,
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
        handleSpecial(mId, isSpecial) {
            const postData = { mId, isSpecial };
            this.$confirm("确定要把该商家设置三级的操作吗？")
                .then(() => special(postData))
                .then(r => {
                    this.getList();
                    this.$message.success(r.msg);
                })
                .catch(() => (this.loading = false))
                .finally(() => (this.loading = false));
        },
        handleOpen(refName, index, sts) {
            var target = this.$refs[refName];
            const f = this.postList[index];
            if (sts == undefined) {
                // Object.assign(target.form, f);

                if (refName == "update") {
                    target.form.id = f.id;
                    target.getInfo();
                } else {
                    target.form.merId = f.id;
                    target.form.merAccount = f.merAccount;
                    target.form.exId = f.exId;
                }
            } else {
                target.form.merId = f.id;
                target.form.status = f.state == 2 ? 1 : 2;
                target.form.remarks = "";
            }
            target.dialogVisible = true;
        },
        handleSend(data) {
            let merAccountList = [];
            if (data) {
                merAccountList.push(data);
            } else {
                merAccountList = this.merAccountList.map(v => v.merAccount);
            }
            if (merAccountList.length == 0) {
                this.$message.error("请先选择要发送站内信的商家");
                return;
            }
            var target = this.$refs.sendLetter;
            target.form.merAccountList = merAccountList;
            target.handleOpen();
        },
        showReason(remark) {
            return remark == "";
        },
        handleReview(index, sts) {
            this.loading = true;
            var data = this.postList[index];
            this.$confirm(
                "确定要进行 商家ID " +
                    data.id +
                    " " +
                    this.review.title[sts] +
                    " 操作吗？"
            )
                .then(r => {
                    var d;
                    if (sts < 2) {
                        d = { merId: data.id };
                    } else {
                        d = { id: data.id, note: data.note };
                    }
                    this.review.fn[sts](d)
                        .then(r => {
                            this.getList();
                            this.$message.success(r.msg);
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
        },

        /** 导出按钮操作 */
        handleExport() {
            const queryParams = this.queryParams;
            this.$confirm("是否确认导出所有岗位数据项?", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.loading = true;
                exportExcel(this.queryParams)
                    .then(r => {
                        this.download(r.data.data);
                        this.$message.success(r.data.msg);
                    })
                    .finally(e => {
                        this.loading = false;
                    });
            });
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
    .el-button {
        margin-left: 0;
        &:nth-child(even) {
            width: 100px;
        }
        &:nth-child(n-2) {
            margin-bottom: 4px;
        }
    }
}
/deep/.el-table th.gutter {
    display: table-cell !important;
}
/deep/.el-select-dropdown__list {
    width: 180px;
}
</style>