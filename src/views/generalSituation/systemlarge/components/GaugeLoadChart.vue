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
      default: "350px"
    },

    chartData: {
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
    chartData: {
      handler(newVal, oldVal) {
        if (this.chart) {
          if (newVal) {
            this.setOption(newVal);
          } else {
            this.setOption(oldVal);
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
      if (this.chartData.listData) {
        this.chart.hideLoading();
        this.setOptions(this.chartData);
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

    setOptions({ title, listData } = {}) {
      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}"
        },

        series: [
          {
            name: title,

            splitNumber: 1,
            title: {
              offsetCenter: [0, "90%"],
              color: "#558cf7",
              fontSize: 18
            },
            axisLine: {
              show: true,
              lineStyle: {
                width: 30,
                color: [
                  [0.5, "#558cf7"],
                  [1, "#e3ebff"]
                ]
              }
            },

            axisLabel: {
              distance: 15,
              fontSize: 16,
              color: "#909399"
            },

            pointer: {
              show: false
            },
            axisTick: {
              // show: false
            },
            //
            radius: "90%",
            min: 0,
            max: 100,
            type: "gauge",
            center: ["50%", "50%"],
            detail: {
              offsetCenter: [0, "0%"],
              fontSize: 40,
              formatter: "{value}%"
            },
            data: listData
          }
        ]
      });
      this.chart.hideLoading();
    }
  }
};
</script>
