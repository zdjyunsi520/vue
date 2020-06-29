<template>
    <div class="app-container ">
        <el-row :gutter="20" class="comheight dragbox" ref="dragbox">
            <el-col :xs="{span: 24}" class="treebox comheight dragleft">
                <div style="background:#fff;height:100%;padding-left:10px;">
                    <el-scrollbar v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading"  element-loading-spinner="el-icon-loading">
                        <el-tree ref="tree" node-key="id" :data="treeData"   :props="defaultProps" class="comheight" :highlight-current="true" @node-click="handleNodeClick" :default-expand-all='false' :expand-on-click-node="false">
                            <span class="el-tree-node__label" slot-scope="{ node, data }">
                                <svg-icon icon-class="gongsi" class="tablesvgicon"></svg-icon>
                                {{ data.text }}
                            </span>
                        </el-tree>
                    </el-scrollbar>
                </div>
            </el-col>
            <el-col class="dragresize">
                <span class="iconslider">
                    <svg-icon icon-class="ic_drag" style="font-size:26px;margin-left:-9px;" />
                    <i class="el-icon-arrow-left" style="font-size:12px;margin-left:-2px;" />
                </span>
            </el-col>
            <el-col :xs="{span: 24}" class="app-container dragright mxright" style="padding-top:0;padding-bottom:0;">
                <div style="height:100%">
                    <el-scrollbar v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.4)" element-loading-text="Loading" element-loading-spinner="el-icon-loading">
                        <div>
                            <el-row :gutter="20">
                                <el-col :span="8" :xs="24">
                                    <div class="smdatabox bluebg">
                                        <h6>
                                            <i class="svgcolor1">
                                                <svg-icon icon-class="ic_project" /></i> 概况
                                        </h6>
                                        <el-row>
                                            <el-col :span="6">
                                                <p>
                                                    <span>
                                                        总用户数(户)<br /><b>{{dataInfo.TotalUserCount}}</b>
                                                    </span>
                                                </p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>
                                                    <span>
                                                        总容量(kVA)<br /><b>{{dataInfo.TotalContractCapacity}}</b>
                                                    </span>
                                                </p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>
                                                    <span>配电房(个)<br /><b>{{dataInfo.SwitchingRoomCount}}</b></span>
                                                </p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>
                                                    <span>安全运行(天)<br /><b>{{dataInfo.RunningDays}}</b></span>
                                                </p>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="smdatabox b-bluebg">
                                        <h6>
                                            <i class="svgcolor2">
                                                <svg-icon icon-class="ic_project" /></i> 运维规模
                                        </h6>
                                        <el-row>
                                            <el-col :span="8">
                                                <p>
                                                    <span>运维城市(个)<br /><b>{{dataInfo.OperationSituation.OperationCityCount}}</b></span>
                                                </p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>
                                                    <span>运维中心(个)<br /><b>{{dataInfo.OperationSituation.OperationCenterCount}}</b></span>
                                                </p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>
                                                    <span>运维人员(个)<br /><b>{{dataInfo.OperationSituation.OperationUserCount}}</b></span>
                                                </p>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="smdatabox orangebg">
                                        <h6>
                                            <i class="svgcolor3">
                                                <svg-icon icon-class="ic_project" /></i> 运维成果
                                        </h6>
                                        <el-row>
                                            <el-col :span="8">
                                                <p>
                                                    <span>总巡检(次)<br /><b>{{dataInfo.OperationSituation.TotalPatrolCount}}</b></span>
                                                </p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>
                                                    <span>总预警(次)<br /><b>{{dataInfo.OperationSituation.TotalWarningCount}}</b></span>
                                                </p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>
                                                    <span>总抢修(次)<br /><b>{{dataInfo.OperationSituation.TotalRepairCount}}</b></span>
                                                </p>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <div class="bg-white" style="position:relative">
                                        <div class="form-smtitle ">
                                            用电负荷(kW)
                                        </div>
                                        <div class="chart-wrapper">
                                            <el-row class="legendbox lx" v-if="radioType==0">
                                                <el-col :span="8">
                                                    <p>今日最高<span>{{electricLoad.TodayHighest}}</span></p>
                                                </el-col>
                                                <el-col :span="8">
                                                    <p>昨日最高<span>{{electricLoad.YesterdayHighest}}</span></p>
                                                </el-col>
                                                <el-col :span="8">
                                                    <p>日平均<span>{{electricLoad.DailyAverage}}</span></p>
                                                </el-col>
                                            </el-row>
                                            <el-row class="legendbox lx" v-else>
                                                <el-col :span="8">
                                                    <p>本月最高<span>{{electricLoad.ThisMonthHighest}}</span></p>
                                                </el-col>
                                                <el-col :span="8">
                                                    <p>上月最高<span>{{electricLoad.LastMonthHighest}}</span></p>
                                                </el-col>
                                                <el-col :span="8">
                                                    <p>月平均<span>{{electricLoad.MonthlyAverage}}</span></p>
                                                </el-col>
                                            </el-row>
                                            <div class="rightradiobox">
                                                <el-radio-group v-model="radioType" @change='handleSetLineChartData(radioType)' size="mini">
                                                    <el-radio-button :label="0">日</el-radio-button>
                                                    <el-radio-button :label="1">月</el-radio-button>
                                                </el-radio-group>
                                            </div>
                                            <line-chart ref='loadlinechart' :linechartData="lineChartData" />
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top:20px;">
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            抢修情况(次)
                                        </div>
                                        <el-row :gutter="5" class="legendbox">
                                            <el-col :span="11" :xs="24">
                                                    <el-col :span="12">
                                                        <p>累计报修<span>{{dataInfo.RepairThisMonth.ApplyCount}}</span></p>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <p>累计抢修<span>{{dataInfo.RepairThisMonth.DispatchCount}}</span></p>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <p>已完成<span>{{dataInfo.RepairThisMonth.CompletionCount}}</span></p>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <p>未完成<span>{{dataInfo.RepairThisMonth.InCompletionCount}}</span></p>
                                                    </el-col>
                                            </el-col>
                                            <el-col :span="13" :xs="24">
                                                <PieChart :chartData='repairPieChartData' />
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            巡视情况(次)
                                        </div>
                                        <el-row :gutter="10" class="legendbox">
                                            <el-col :span="10" :xs="24">
                                                <el-col :span="24" :xs="12">
                                                    <p>本月计划巡检<span>{{dataInfo.PatrolThisMonth.PlanCount}}</span></p>
                                                </el-col>
                                                <el-col :span="24" :xs="12">
                                                    <p>本月实际巡检<span>{{dataInfo.PatrolThisMonth.ExecutedCount}}</span></p>
                                                </el-col>
                                            </el-col>
                                            <el-col :span="14" :xs="24">
                                                <PieChart :chartData='patrolPieChartData' />
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            采集情况(个)
                                        </div>
                                        <el-row :gutter="10" class="legendbox">
                                            <el-col :span="10" :xs="24">
                                                <el-col :span="24" :xs="12">
                                                    <p>采集器<span>{{dataInfo.CollectSituation.DataServerCount}}</span></p>
                                                </el-col>
                                                <el-col :span="24" :xs="12">
                                                    <p>表计<span>{{dataInfo.CollectSituation.ElectricMeterCount}}</span></p>
                                                </el-col>
                                            </el-col>
                                            <el-col :span="14" :xs="24">
                                                <PieChart :chartData='collectionPieChartData' />
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" style="margin-top:20px;">
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            告警情况(次)
                                        </div>
                                        <el-row :gutter="10" class="legendbox">
                                            <el-col :span="6">
                                                <p>本月累计<span>{{dataInfo.WarningThisMonth.TotalCount}}</span></p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>本月新增<span>{{dataInfo.WarningThisMonth.AddUpCount}}</span></p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>上月累计<span>{{dataInfo.WarningLastMonth.TotalCount}}</span></p>
                                            </el-col>
                                            <el-col :span="6">
                                                <p>未处理<span>{{dataInfo.WarningThisMonth.UnProcessedCount}}</span></p>
                                            </el-col>
                                        </el-row>
                                        <AlarmPieChart ref="alarmchartChart" :piechartData='alarmchartData' />
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            用电情况(kWh)
                                        </div>

                                        <el-row :gutter="20" class="legendbox">
                                            <el-col :span="8">
                                                <p>本月<span>{{electricSituation.ThisMonthAddUp}}</span></p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>上月<span>{{electricSituation.LastMonthAddUp}}</span></p>
                                            </el-col>
                                            <el-col :span="8">
                                                <p>累计(年)<span>{{electricSituation.YearAddUp}}</span></p>
                                            </el-col>
                                        </el-row>
                                        <BarChart ref='structureBarChart' :barchartData='structureChartData' />
                                    </div>
                                </el-col>
                                <el-col :span="8" :xs="24">
                                    <div class="bg-white">
                                        <div class="form-smtitle ">
                                            用电类型统计(户)
                                        </div>
                                        <div v-show='!nodatabox'>
                                            <el-row :gutter="20" class="legendbox">
                                                <el-col :span="8" v-for="(item,index) in electricTypeStatistic" :key="index">
                                                    <p>{{item.Text}}<span>{{item.Count}}</span></p>
                                                </el-col>
                                            </el-row>
                                            <BarChart ref="typeChart" :barchartData='typeChartData' />
                                        </div>
                                        <div class="nodata-box"  v-show='nodatabox' style='height:350px;padding: 100px 0;'>
                                                <img src="@/assets/image/nodata.png" class='smimg' />
                                                <p>暂时还没有数据</p>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-scrollbar>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { fetchTree } from "@/api/systemManager/organization";
import {
    getSysBaseInfo,
    getSysElectricLoad,
    getSysElectricSituation
} from "@/api/report";

import PieChart from "./components/PieChart";
import LineChart from "./components/LineChart";

import AlarmPieChart from "./components/AlarmPieChart";
import BarChart from "./components/BarChart";
const repairPieChartData = {
    title: "抢修情况",
    text: "抢修完成率",
    colors: ["#558cf7", "#e3ebff"],
    listData: [
        {
            value: 0,
            name: "已完成"
        },
        {
            value: 100,
            name: "未完成"
        }
    ]
};
const patrolPieChartData = {
    title: "巡视情况",
    text: "巡视完成率",
    colors: ["#81c7f9", "#daf0ff"],
    listData: [
        {
            value: 0,
            name: "本月计划巡检"
        },
        {
            value: 100,
            name: "本月实际巡检"
        }
    ]
};
const collectionPieChartData = {
    title: "采集情况",
    text: "在线率",
    colors: ["#f4a248", "#ffedda"],
    listData: [
        {
            value: 0,
            name: "在线"
        },
        {
            value: 100,
            name: "离线"
        }
    ]
};
const lineChartData = [
    {
        legendData: ["今日负荷", "昨日负荷"],
        xAxisData: [],
        expectedData: [],
        actualData: []
    },
    {
        legendData: ["本月负荷", "上月负荷"],
        xAxisData: [],
        expectedData: [],
        actualData: []
    }
];
const alarmchartData = {
    xAxisData: [],
    listData: []
};
const structureChartData = {
    ytext: "单位(kWh)",
    xAxisData: [],
    legendData:["尖峰", "高峰", "平时", "低谷"],
    listData: [
        {
            name: "尖峰",
            value: 0,
            itemStyle: {
                color: "#f4a248"
            }
        },
        {
            name: "高峰",
            value: 0,
            itemStyle: {
                color: "#f6cf71"
            }
        },
        {
            name: "平时",
            value: 0,
            itemStyle: {
                color: "#558cf7"
            }
        },
        {
            name: "低谷",
            value: 0,
            itemStyle: {
                color: "#81c7f9"
            }
        }
    ]
};
const typeColors = ["#f4a248","#558cf7","#81c7f9"]
const typeChartData = {
    ytext: "单位(kWh)",
    xAxisData: [],
    listData: []
};
export default {
    name: "baseData",
    components: {
        PieChart,
        LineChart,
        AlarmPieChart,
        BarChart
    },

    data() {
        return {
            treeData: [],
            defaultProps: {
                children: "childs",
                label: "text"
            },
            lineChartData: lineChartData[0],
            radioType: 0,
            loading: false,
            structureChartData: structureChartData,
            typeChartData: typeChartData,
            repairPieChartData: repairPieChartData,
            patrolPieChartData: patrolPieChartData,
            collectionPieChartData: collectionPieChartData,
            alarmchartData: alarmchartData,
            tenantId: "",
            dataInfo: {
                OperationSituation: {},
                RepairThisMonth: {},
                PatrolThisMonth: {},
                CollectSituation: {},
                WarningThisMonth: {},
                WarningLastMonth: {},
                WarningTypeSituation: []
            },
            electricSituation: {},
            electricLoad: {
                DayCurve: {},
                MonthCurve: {}
            },
            electricTypeStatistic: {},
            warningTypeSituation: [],
            nodatabox:false,
        };
    },
    mounted() {
        this.dragControllerDiv();
        this.getTree();
    },
    created() {},
    methods: {
        getTree() {
            fetchTree({}).then(r => {
                this.treeData = r.data;
                if (r.data.length) {
                    this.handleNodeClick(r.data[0]);
                    this.tenantId = this.treeData[0].id;
                    this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(this.tenantId);
                    });
                }
            });
        },
        getSysBaseInfo(tenantId) {
            var tenantId = tenantId;
            getSysBaseInfo({ tenantId }).then(r => {
                this.dataInfo = r.data;
                this.electricTypeStatistic = this.dataInfo.ElectricTypeStatistic;
                
                if(this.electricTypeStatistic.length>0){
                    this.nodatabox=false;
                    this.typeChartData.xAxisData = [];
                    this.typeChartData.listData=[];
                    this.electricTypeStatistic.map((v, i) => {
                        this.typeChartData.xAxisData.push(v.Text);
                        this.typeChartData.listData.push({
                            name:v.Text,
                            value:v.Count,
                            itemStyle: {
                                color: typeColors[i]
                            }
                        });
                    });
                    this.$nextTick(() => {
                        this.$refs.typeChart.initChart();
                    });
                }else{
                    this.nodatabox=true;
                }

                this.warningTypeSituation = this.dataInfo.WarningTypeSituation;
                this.alarmchartData.xAxisData = [];
                this.alarmchartData.listData = [];
                this.warningTypeSituation.map((v, i) => {
                    this.alarmchartData.xAxisData.push(v.Text);
                    this.alarmchartData.listData.push({
                        value: v.Count,
                        name: v.Text
                    });
                });
                this.$nextTick(() => {
                    this.$refs.alarmchartChart.initChart();
                });

                this.collectionPieChartData.listData[0].value = this.dataInfo.CollectSituation.OnlineRate;
                this.repairPieChartData.listData[0].value = this.dataInfo.RepairThisMonth.CompletionRate;
                this.patrolPieChartData.listData[0].value = this.dataInfo.PatrolThisMonth.CompletionRate;

            });
        },
        getSysElectricLoad(tenantId) {
            var tenantId = tenantId;
            getSysElectricLoad({ tenantId }).then(r => {
                this.electricLoad = Object.assign({}, r.data);
                lineChartData[0].xAxisData = this.electricLoad.DayCurve.XAxis;
                lineChartData[0].expectedData = this.electricLoad.DayCurve.Today;
                lineChartData[0].actualData = this.electricLoad.DayCurve.Yesterday;
                lineChartData[1].xAxisData = this.electricLoad.MonthCurve.XAxis;
                lineChartData[1].expectedData = this.electricLoad.MonthCurve.ThisMonth;
                lineChartData[1].actualData = this.electricLoad.MonthCurve.LastMonth;
                this.$nextTick(() => {
                    this.$refs.loadlinechart.initChart();
                });
            });
        },

        getSysElectricSituation(tenantId) {
            var tenantId = tenantId;
            getSysElectricSituation({ tenantId }).then(r => {
                this.electricSituation = r.data;
                this.structureChartData.xAxisData = [
                    "尖峰",
                    "高峰",
                    "平时",
                    "低谷"
                ];
                this.structureChartData.listData[0].value = this.electricSituation.Sharp;
                this.structureChartData.listData[1].value = this.electricSituation.Peak;
                this.structureChartData.listData[2].value = this.electricSituation.Flat;
                this.structureChartData.listData[3].value = this.electricSituation.Valley;
                this.$nextTick(() => {
                    this.$refs.structureBarChart.initChart();
                });
            });
        },

        handleNodeClick(data) {
            this.getSysBaseInfo(data.id);
            this.getSysElectricLoad(data.id);
            this.getSysElectricSituation(data.id);
        },
        // 用电负荷 日/月切换
        handleSetLineChartData(type) {
            this.lineChartData = lineChartData[type];
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/treeEquipment.scss";
.dragbox .dragleft{
  width:300px;
}
.dragbox .dragright.mxright{
   width: calc(100% - 310px);
}
.app-container {
    font-size: 14px;
}
h6 {
    margin: 0;
}
/deep/.form-smtitle {
    padding: 20px 20px 0px;
    font-weight: normal;
    font-size: 16px;
    margin: 0;
}

.legendbox {
    padding: 10px 30px 10px;
    &.lx {
        width: 60%;
        padding-top: 0;
        margin-left: 20% !important;
    }
    p {
        color: #999;
        font-size: 14px;
        text-align: center;
        padding-bottom: 0;
        span {
            display: block;
            padding-top: 10px;
            color: #333;
            font-size: 24px;
        }
    }
}
.chart-wrapper {
    background: #fff;
    padding: 0 20px;
    .rightradiobox {
        position: absolute;
        top: 30px;
        right: 30px;
    }
}
.smtitle1 {
    text-align: center;
    padding: 30px 30px 15px;
    margin: 0;
    font-size: 14px;
    font-weight: normal;
}

@media (max-width: 1024px) {
    .chart-wrapper {
        padding: 0 8px;
    }
}

/deep/.dragright .el-scrollbar__bar.is-horizontal {
    display: none;
}
.svgcolor1 {
    color: #558cf7;
}
.svgcolor2 {
    color: #77c3f9;
}
.svgcolor3 {
    color: #f3a248;
}
</style>
