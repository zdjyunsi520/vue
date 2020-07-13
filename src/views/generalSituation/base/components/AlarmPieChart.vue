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
      default: "250px"
    },
    piechartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    piechartData: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOptions(newVal);
          } else {
            this.setOptions(oldVal);
          }
        } else {
          this.initChart();
        }
      },
      deep: true //对象内部属性的监听，关键。
    }
  },
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
      this.showLoading();
      if (this.piechartData.xAxisData.length > 0) {
        this.chart.hideLoading();
        this.setOptions(this.piechartData);
      }
    },
    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#999999",
        textColor: "#999",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },

    setOptions({ xAxisData, listData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
          show: true,
          left: "40px",
          top: "30px",
          itemWidth: 6,
          itemHeight: 6,
          icon: "circle",
          textStyle: {
            color: "#909399"
          },
          orient: "vertical",
          data: xAxisData
          // [
          //   "越上上限",
          //   "分闸",
          //   "越下限",
          //   "告警",
          //   "工况异常",
          //   "超温",
          //   "越上限",
          //   "过压"
          // ]
        },

        color: [
          "#4982f7",
          "#588ef7",
          "#81c7f9",
          "#c1e2fc",
          "#f4a248",
          "#fed3a3",
          "#f6cf71",
          "#fbeac1"
        ],
        series: [
          {
            name: "告警情况",
            type: "pie",
            // roseType: "radius",
            label: {
              show: false
              // position: "center"
            },
            labelLine: {
              show: false
            },
            emphasis: {
              label: {
                show: false,
                fontSize: "14",
                formatter: "{c}次\n{b}"
              },
              labelLine: {
                show: false
              }
            },

            radius: "50%",
            center: ["65%", "50%"],
            data: listData
          }
        ]
      });
    }
  }
};
</script>
