<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "180px"
    }
    // pieChartData: {
    //   type: Number,
    //   required: true
    // }
  },
  data() {
    return {
      chart: null
    };
  },
  // watch: {
  //   pieChartData: {
  //     deep: true,
  //     handler(val) {
  //   console.log('333',this.pieChartData)
  //       this.setOptions(val)
  //     }
  //   }
  // },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, "macarons");
      // this.setOptions(this.pieChartData)
      //},
      // setOptions(actualData){
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: false,
          right: "0",
          bottom: "10",
          data: ["已完成", "未完成"]
        },
        color: ["#558cf7", "#e3ebff"],
        series: [
          {
            name: "抢修情况",
            type: "pie",
            radius: ["55%", "80%"],
            center: ["50%", "50%"],
            emphasis: {
              itemStyle: {
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowBlur: 5
              }
            },
            data: [
              {
                value: 33,
                name: "已完成",
                label: {
                  normal: {
                    show: true,
                    position: "center",
                    fontSize: 14,
                    formatter: "{d}%\n\n抢修完成率"
                  }
                }
              },
              {
                value: 11,
                name: "未完成",
                label: {
                  normal: {
                    show: false
                  }
                }
              }
            ],
            labelLine: {
              show: false
            }
          }
        ]
      });
    }
  }
};
</script>
