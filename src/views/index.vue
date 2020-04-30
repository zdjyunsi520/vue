<template>
    <div>
        <div class="dashboard-editor-container">
            <panel-group ref="countView" v-hasPermi="['system:index:selectIndexStatistics']" @handleSetLineChartData="handleSetLineChartData" />
        </div>
        <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>-->

        <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>-->

        <div class="xl-container" v-hasPermi="['system:index:selectDeptStatistics']">
            <ul>
                <li>
                    分站佣金配置
                    <span class="xl-gold">{{ data.deptCommisionRate * 100 }}%</span>
                </li>
                <li>
                    账户余额
                    <span class="xl-gold">{{ data.deptUsableProfit }}</span>元， 累计赚取
                    <span class="xl-gold">{{ data.deptProfit }}</span>元
                </li>
                <li>
                    累计邀请商家
                    <span class="xl-blue">{{ data.merCount }}</span>， 商家累计发单
                    <span class="xl-blue">{{ data.totalOrder }}</span>单, 已完结订单
                    <span class="xl-blue">
                        {{
            data.orderQuantityFinished
            }}
                    </span>单
                </li>
                <li>
                    累计邀请推广员
                    <span class="xl-blue">{{ data.exCount }}</span>
                </li>
                <li>
                    <span>复制链接发送邀请给好友</span>
                </li>
                <li v-for="item in data.urlEx">
                    <span>推广推广员链接：{{ item }}</span>
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, item, $event)">复制链接</el-button>
                </li>
                <li v-for="item in data.url">
                    <span>推广商家链接：{{ item }}</span>
                    <el-button size="mini" type="danger" @click="$event => handleClipboard.call(this, item, $event)">复制链接</el-button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import handleClipboard from "@/utils/clipboard";
import { getIndexInfo } from "@/api/login";
const lineChartData = {
    newVisitis: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
        expectedData: [200, 192, 120, 144, 160, 130, 140],
        actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
        expectedData: [80, 100, 121, 104, 105, 90, 100],
        actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
        expectedData: [130, 140, 141, 142, 145, 150, 160],
        actualData: [120, 82, 91, 154, 162, 140, 130]
    }
};

export default {
    name: "Index",
    components: {
        PanelGroup,
        LineChart,
        RaddarChart,
        PieChart,
        BarChart
    },
    data() {
        return {
            lineChartData: lineChartData.newVisitis,
            data: {
                url: "",
                urlEx: "",
                deptUsableProfit: "0",
                deptProfit: "0",
                merCount: "0",
                totalOrder: "0",
                orderQuantityFinished: "0",
                exCount: "0",
                deptCommisionRate: "0"
            }
        };
    },
    computed: {
        ...mapState(["user"])
    },
    created() {
        getIndexInfo().then(r => {
            this.data = r.data;
            this.user.deptCommisionRate = r.data.deptCommisionRate;
        });
    },
    methods: {
        handleClipboard,
        handleSetLineChartData(type) {
            this.lineChartData = lineChartData[type];
        }
    }
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }
}

@media (max-width: 1024px) {
    .chart-wrapper {
        padding: 8px;
    }
}

.xl-container {
    ul {
        box-shadow: 0 1px 15px 1px rgba(69, 65, 78, 0.08);
        border: 1px solid #eee;
        padding: 10px 20px;
        list-style: none;
        li {
            line-height: 30px;
            color: #343536;
            span {
                font-weight: bold;
            }
        }
    }
    p {
        font-size: 20px;
        color: #222;
        padding: 15px;
    }
    .xl-share {
        padding: 15px;
    }

    .xl-gold {
        color: #fc6900;
    }
    .xl-blue {
        color: #1890ff;
    }
}
.xl-text-align {
    text-align: center;
}
</style>
