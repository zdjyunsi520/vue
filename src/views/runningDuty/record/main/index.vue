<template>
    <div class="comheight">
        <el-scrollbar>
            <el-row class="rowbox">
                <!-- <div v-if="currentData.length==0">
          <div class="nodata-box">
            <img src="@/assets/image/nodata.png" />
            <p>暂时还没有数据</p>
          </div>
        </div> -->
                <div>
                    <div class="leftcard">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>接班信息</span>
                            </div>
                            <div class="text item">
                                <el-form ref="form" :model="form" :rules="rules" :inline="true">
                                    <el-form-item prop="PositionName">
                                        <el-input :value='"岗位："+form.PositionName' disabled />
                                    </el-form-item>
                                    <el-form-item prop="StartTime">
                                        <el-input :value="'接班时间：'+(form.StartTime?this.parseTime(form.StartTime, '{y}-{m}-{d} {hh}:{mm}:{ss}'):'')" disabled />
                                    </el-form-item>
                                    <el-form-item prop="UserName">
                                        <el-input :value="'接班人：'+form.UserName" disabled />
                                    </el-form-item>
                                    <el-form-item prop="Weather">
                                        <el-select v-model="form.Weather" placeholder="请选择天气">
                                            <el-option label="晴" :value="1"></el-option>
                                            <el-option label="阴" :value="2"></el-option>
                                            <el-option label="雨" :value="3"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="Temperature">
                                        <el-input v-model="form.Temperature" placeholder="请输入温度" />
                                    </el-form-item>
                                    <el-form-item class="cardbtns">
                                        <el-button type="primary" size="mini" :disabled='isDisabled' @click="handleAccept">接班</el-button>
                                        <el-button type="info" size="mini" :disabled='isDisabled' plain @click="handleReset">重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <div :class="isDisabled?'databtnbox left':'databtnbox left blue'">
                            <el-button type="primary" :plain='isDisabled' circle size="mini">接</el-button>
                            <label>{{startTime.replace(/0:00:00/,'')}}</label>
                        </div>
                    </div>
                    <div class="rightcard">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span>交班信息</span>
                            </div>
                            <div class="text item">
                                <el-form ref="form1" :model="form1" :rules="rules" :inline="true">
                                    <el-form-item prop="PositionName">
                                        <el-input :value='"岗位："+form1.PositionName' disabled />
                                    </el-form-item>
                                    <el-form-item prop="StartTime">
                                        <el-input :value="'交班时间：'+ (form1.StartTime?this.parseTime(form1.StartTime, '{y}-{m}-{d} {hh}:{mm}:{ss}'):'')" disabled />
                                    </el-form-item>
                                    <el-form-item prop="UserName">
                                        <el-input :value="'交班人：'+form1.UserName" disabled />
                                    </el-form-item>
                                    <el-form-item prop="Weather">
                                        <el-select v-model="form1.Weather" placeholder="请选择天气">
                                            <el-option label="晴" :value="1"></el-option>
                                            <el-option label="阴" :value="2"></el-option>
                                            <el-option label="雨" :value="3"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="Temperature">
                                        <el-input v-model="form1.Temperature" placeholder="请输入温度" />
                                    </el-form-item>
                                    <el-form-item class="cardbtns">
                                        <el-button type="primary" size="mini" @click="handleAccept1" :disabled='isDisabled1'>交班</el-button>
                                        <!-- <el-button type="primary" size="mini" plain>召回</el-button> -->
                                        <el-button type="info" size="mini" plain @click="handleReset1" :disabled='isDisabled1'>重置</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-card>
                        <div :class="isDisabled1?'databtnbox right ':'databtnbox right blue'">
                            <label>{{endTime.replace(/0:00:00/,'')}}</label>
                            <el-button type="primary" :plain='isDisabled1' circle size="mini">交</el-button>
                        </div>
                    </div>
                </div>
            </el-row>

        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { addHandover, updateHandover } from "@/api/runningDuty/record";

export default {
    name: "user",
    components: {},
    props: {
        currentData: {
            type: Object,
            default() {
                return {};
            }
        },
        dataTime: {
            type: Object
        },
        userPositions: {
            type: Array,
            default() {
                return [];
            }
        },
        TeamId: {
            type: String,
            default: ""
        }
    },

    data() {
        const rules = {
            // Weather: [
            //   {
            //     required: true,
            //     message: "请选择天气",
            //     trigger: "change"
            //   }
            // ],
            // Temperature: [
            //   {
            //     required: true,
            //     message: "请填写气温",
            //     trigger: "blur"
            //   }
            // ]
        };
        return {
            rules,
            form: {
                PositionName:'',
                UserName:''
            },
            form1: {
                PositionName:'',
                UserName:''
                },
            startTime: "",
            endTime: "",
            StartTime: "",
            EndTime: "",
            PositionName: "",
            positionIds: []
        };
    },

    mounted() {},
    watch: {
        currentData: {
            handler: function(val, oldval) {
                this.startTime = "";
                this.endTime = "";
                this.StartTime = "";
                this.EndTime = "";
                var newval = [];
                if (val) {
                    var newval = val.model;
                    this.startTime = val.startTime;
                    this.endTime = val.endTime;
                }
                let PositionName = newval.map(v => v.TeamName).join(",");

                let UserName = "";
                let Weather = "";
                let Temperature = "";
                let StartTime = "";
                let EndTime = "";

                if (PositionName == "" && this.userPositions) {
                    let ll = this.userPositions.filter(v => {
                        return v.EmployeeIds.indexOf(this.userId) > -1;
                    });
                    PositionName = ll.map(v => v.PositionName).join(",");
                    this.positionIds = ll.map(v => v.PositionId).join(",");
                    newval = [{}];
                }

                if (PositionName) {
                    UserName = newval[0].UserName || this.name;
                    Weather = newval[0].Weather;
                    Temperature = newval[0].Temperature;
                    StartTime = newval[0].StartTime;
                    EndTime = newval[0].EndTime;
                    if (newval[0].PositionId)
                        this.positionIds = newval[0].PositionId;
                    this.StartTime = StartTime;
                    this.EndTime = EndTime;
                }

                this.PositionName = PositionName;
                this.reset({
                    PositionName,
                    UserName,
                    Weather,
                    Temperature,
                    StartTime
                });
                this.reset1({ PositionName, UserName, StartTime: EndTime });
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters({
            companyType: "status/companyType",
            name: "name",
            userId: "userId"
        }),
        isDisabled() {
            if (this.PositionName && !this.StartTime && this.startTime) {
                let endTime = this.startTime.split(" ");
                if (new Date() > new Date(endTime[0] + " " + endTime[2])) {
                    this.goon = false;
                    this.getCurrentDate();
                    return false;
                }
            }
            this.goon = true;
            return true;
        },
        isDisabled1() {
            if (
                this.StartTime &&
                this.PositionName &&
                !this.EndTime &&
                this.endTime
            ) {
                let endTime = this.endTime.split(" ");
                if (new Date() > new Date(endTime[0] + " " + endTime[2])) {
                    this.goon1 = false;
                    this.getCurrentDate1();
                    return false;
                }
            }
            this.goon1 = true;
            return true;
        }
    },
    methods: {
        getCurrentDate() {
            if (!this.goon)
                setTimeout(() => {
                    this.form.StartTime = new Date();
                    this.getCurrentDate();
                }, 1000);
            else this.form.StartTime = "";
        },
        getCurrentDate1() {
            if (!this.goon1)
                setTimeout(() => {
                    this.form1.StartTime = new Date();
                    this.getCurrentDate1();
                }, 1000);
            else this.form1.StartTime = "";
        },
        handleAccept1() {
            this.$refs.form1.validate(v => {
                if (v) {
                    var newval = this.currentData.model;
                    let Ids = newval.map(v => v.Id);
                    let endtime = new Date();
                    let weather = this.form.Weather;
                    let temperature = this.form.Temperature;
                    updateHandover({
                        Ids,
                        endtime,
                        weather,
                        temperature
                    }).then(r => {
                        this.goon1 = false;
                        this.EndTime = endtime;
                        this.$message.success("交班成功");
                    });
                }
            });
        },
        handleAccept() {
            this.$refs.form.validate(v => {
                if (v) {
                    let positionIds = this.positionIds;
                    let dutyTeamId = this.TeamId;
                    let starttime = new Date();
                    let weather = this.form.Weather;
                    let temperature = this.form.Temperature;
                    addHandover({
                        positionIds,
                        dutyTeamId,
                        starttime,
                        weather,
                        temperature
                    }).then(r => {
                        this.$message.success("接班成功");
                        this.goon = false;
                        this.StartTime = starttime;
                    });
                }
            });
        },
        handleReset() {
            this.form.Temperature = "";
            this.form.Weather = "";
        },
        handleReset1() {
            this.form1.Temperature = "";
            this.form1.Weather = "";
        },
        reset(data) {
            this.form = Object.assign(
                {
                    StartTime: "",
                    UserName: "",
                    Weather: "",
                    Temperature: "",
                    PositionName: ""
                },
                data
            );
            this.$refs.form.clearValidate();
        },
        reset1(data) {
            this.form1 = Object.assign(
                {
                    StartTime: "",
                    UserName: "",
                    Weather: "",
                    Temperature: "",
                    PositionName: ""
                },
                data,
                {
                    Weather: "",
                    Temperature: ""
                }
            );
            this.$refs.form1.clearValidate();
        }
    }
};
</script>

<style lang="scss" scoped>
/deep/.el-card {
    width: 360px;
    .el-card__header {
        padding: 15px 30px;
        border-bottom: none;
        box-sizing: border-box;
        background-color: #f9fafd;
    }
    .el-card__body {
        padding: 20px 30px;
        .el-form {
            padding-right: 0px;
            .el-form-item {
                margin-bottom: 15px;
                margin-right: 0;
                width: 100%;
            }
            .el-form-item--medium .el-form-item__label {
                line-height: inherit;
                margin-bottom: 15px;
            }
            .el-form-item--medium .el-form-item__content {
                width: 100%;
            }
        }
        .cardbtns {
            margin-bottom: 0 !important;
            text-align: center;
        }
    }
}
.rowbox {
    padding: 30px 0px;
    width: 750px;
    margin-left: -420px;
    position: relative;
    left: 50%;
}
.databtnbox {
    position: absolute;
    z-index: 1;
    .el-button--mini.is-circle {
        height: 40px;
        line-height: 38px;
        padding: 0;
        width: 40px;
        font-size: 18px;
        span {
            font-size: 18px;
        }
    }
    label {
        color: #303133;
        font-weight: normal;
        display: inline-block;
        width: 193px;
        font-size: 14px;
        margin: 0 15px;
    }
    &.left {
        right: -335px;
        top: 42%;

        &::before {
            content: "";
            width: 70px;
            height: 0;
            border-top: solid 1px #dcdfe4;
            display: inline-block;
            vertical-align: middle;
        }
    }
    &.right {
        left: -335px;
        top: 42%;
        &::after {
            content: "";
            width: 70px;
            height: 0;
            border-top: solid 1px #dcdfe4;
            display: inline-block;
            vertical-align: middle;
        }
    }
    &.blue label {
        color: #558cf7;
    }
}
.leftcard {
    display: inline-block;
    position: relative;
    margin-bottom: 70px;
    .el-card {
        float: right;
    }
    &::after {
        content: "";
        width: 1px;
        height: 70vh;
        background-color: #ebeef5;
        display: inline-block;
        position: absolute;
        right: -86px;
        top: 0;
    }
}
.rightcard {
    top: 220px;
    margin-left: -210px;
    left: 50%;
    display: inline-block;
    position: relative;
}
</style>
