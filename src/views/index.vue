<template>

</template>

<script>
import { mapState } from "vuex";
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
  created() {},
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
