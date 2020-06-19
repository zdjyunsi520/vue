<template>

    <div class="app-container">

        <el-row :gutter="20" class="comheight">
            <el-col :span="6" :xs="{span: 24}" class="comheight ">
                <div style="background:#fff;height:100%">
                    <el-scrollbar v-loading="loading" element-loading-text="加载中" element-loading-spinner="el-icon-loading">
                        <div class="left-box">
                            <div class="bztitle">{{dutyGroup.Name}}</div>
                            <div class="queryform">
                                <div>
                                    <label>日期：</label>
                                    <div>
                                        <el-date-picker v-model="form.startdate" style="width:100%" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
                                    </div>
                                </div>
                                <div>
                                    <label>班次：</label>
                                    <div>
                                        <el-radio-group v-model="form.shiftId">
                                            <el-radio :label="item.Id" v-for="(item,index) in shifts" :key="index">{{item.Name}} {{item.StartTime}}-{{item.EndTime}}</el-radio>
                                        </el-radio-group>
                                    </div>
                                </div>
                                <div>
                                    <label>人员：</label>
                                    <div class="tagbox">
                                        <div v-for="(item,index) in userPositions" :key="index">
                                            <el-tag>{{item.PositionName}}</el-tag>
                                            <span :key="index1" v-for="(item1,index1) in item.EmployeeNames.split(',')" v-if="item.EmployeeNames!=''">{{item1}}</span>
                                            <span v-else style="color:#999;font-size:12px;">暂无成员</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col :xs="{span: 24}" :span="18" class=" containerbox ">
                <div class="search-box onlyform-box comflexbox" style="border-bottom:none">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="主记录" name="main"></el-tab-pane>
                        <el-tab-pane label="值班记事" name="dutyRecord"></el-tab-pane>
                        <el-tab-pane label="交接记录" name="shiftRecord"></el-tab-pane>
                        <el-tab-pane label="巡视记录" name="patrolRecord"></el-tab-pane>
                    </el-tabs>
                    <mainComponents ref="main" v-show="activeName == 'main'" :TeamId="form.dutyteamId" :currentData='dataList' :dataTime='dataTime' :userPositions="userPositions" />
                    <dutyRecord ref="dutyRecord" v-show="activeName == 'dutyRecord'" />
                    <shiftRecord ref="shiftRecord" :shifts="shifts" :userPositions="userPositions" v-show="activeName == 'shiftRecord'" />
                    <patrolRecord ref="patrolRecord" :shifts="shifts" :userPositions="userPositions" v-show="activeName == 'patrolRecord'" />
                </div>
            </el-col>
        </el-row>
    </div>

</template>

<script>
import { mapGetters } from "vuex";
import {
    GetUserPositions,
    DutyHandoverGetDutyTeam,
    GetShifts,
    getCurrentInfo
} from "@/api/runningDuty/record";
import dutyRecord from "./dutyRecord";
import shiftRecord from "./shiftRecord";
import patrolRecord from "./patrolRecord";
import mainComponents from "./main";
export default {
    components: { dutyRecord, shiftRecord, patrolRecord, mainComponents },
    data() {
        const rules = {
            teamId: [{ required: true, message: "请选择值班班组" }],
            shifttypeId: [{ required: true, message: "请选择班次类型" }],
            charatype: [{ required: true, message: "请选择角色类型" }]
        };
        return {
            operateId: "",
            loading: false,
            form: {
                startdate: new Date(),
                shiftId: "",
                dutyteamId: ""
            },
            rules,
            assetAttributeType: [{ key: 1, value: "asdas" }],
            listLoading: false,
            dataList: null,
            dataTime: {},
            queryParams: {
                pageno: 1,
                pagesize: 30
            },
            total: 1,
            disabledSelect: false,
            activeName: "main",
            shifts: [],
            userPositions: [],
            dutyGroup: {
                Name: ""
            }
        };
    },

    created() {
        this.getList();
    },
    computed: {
        addDisabled() {
            return (
                !this.form.teamId ||
                !this.form.shifttypeId ||
                !this.form.charatype
            );
        }
    },
    watch: {
        "form.shiftId"() {
            this.getUserPositions();
            this.getCurrentInfo();
        },
        "form.startdate"() {
            this.getUserPositions();
        },

        "form.dutyteamId"() {
            this.getUserPositions();
            this.getCurrentInfo();
        }
    },
    methods: {
        getUserPositions() {
            if (this.form.shiftId && this.form.dutyteamId)
                GetUserPositions({
                    dutyteamId: this.form.dutyteamId,
                    shiftId: this.form.shiftId
                }).then(r => {
                    this.userPositions = r.data;
                });
        },
        getCurrentInfo() {
            this.dataList = null;
            if (this.form.shiftId && this.form.dutyteamId)
                getCurrentInfo(this.form).then(r => {
                    this.dataList = r.data;
                });
        },
        handleClick(tab) {
            const target = this.$refs[this.activeName];
            target.getList();
        },
        getList() {
            DutyHandoverGetDutyTeam({}).then(r => {
                if (r.data) {
                    this.dutyGroup = r.data;
                    this.form.dutyteamId = this.dutyGroup.Id;
                }
            });
            GetShifts({}).then(r => {
                this.shifts = r.data;
                if (r.data && r.data.length) {
                    this.form.shiftId = r.data[0].Id;
                }
            });

            this.listLoading = true;
            // fetchList(this.form)
            //     .then(response => {
            //         this.dataList = response.data;
            //     })
            //     .finally(r => {
            //         this.listLoading = false;
            //     });
        },
        handleSelectionChange() {},

        getInfo(data) {
            this.data = data;
            this.closeComponent();
            const target = this.$refs["component" + data.type];
            target.visible = true;
            target.showBtn = true;
            target.getInfo(data);
        },
        handleConfirm() {
            this.$refs.form.validate(v => {
                if (v) {
                    this.disabledSelect = true;
                }
            });
        },

        handleAdd() {},
        handleUpdate() {},
        handleDelete() {},
        handleSubmit() {}
    }
};
</script>

<style lang="scss" scoped>
/deep/ .onlyform-box .el-form.xl-query .el-form-item {
    margin-bottom: 10px;
}

/deep/.el-tabs__header {
    margin: 0;
}
/deep/.search-box {
    padding: 15px 20px 0px;
    border-bottom: none;
    margin-bottom: -10px;
}
.comheight .containerbox {
    height: 100%;
}
.no-padding {
    padding: 0;
    &:nth-of-type(2) {
        margin-top: 20px;
    }
}
.left-box {
    .bztitle {
        line-height: 60px;
        color: #fff;
        text-align: center;
        font-size: 16px;
        height: 60px;
        background-color: #528cf7;
        border-radius: 2px 2px 0px 0px;
    }
    .queryform {
        padding: 20px;
        & > div {
            margin-bottom: 30px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            .el-radio {
                margin-bottom: 10px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
            & > label {
                font-size: 14px;
                color: #333;
                width: 45px;
                margin-right: 5px;
                padding-top: 5px;
                font-weight: normal;
                margin-bottom: 15px;
                vertical-align: middle;
            }
            & > div {
                flex: 1;
                &.tagbox {
                    .el-tag--medium {
                        margin-right: 10px;
                        border-radius: 2px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                        background: #fff;
                        border: solid 1px #528cf7;
                        color: #528cf7;
                    }
                    & > div {
                        margin-bottom: 14px;
                        font-size: 14px;
                        span {
                            margin-right: 10px;
                            color: #333;
                        }
                    }
                }
            }
        }
    }
}
</style>