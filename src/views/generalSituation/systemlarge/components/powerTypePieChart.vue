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
      default: "100%"
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
      if (this.chartData.listData.length>0) {
        this.chart.hideLoading();
        this.setOptions(this.chartData);
      }
    },
    showLoading() {
      this.chart.showLoading({
        text: "Loading",
        color: "#ffffff",
        textColor: "#ffffff",
        maskColor: "rgba(0, 0, 0, 0)",
        zlevel: 0
      });
    },
    hideLoading() {
      this.chart.hideLoading();
    },
    setOptions({ legendData, listData } = {}) {
      this.chart.setOption({
        backgroundColor: "rgba(0,0,0,0)",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: true,
          top: 0,
          right: 0,
          itemWidth: 6,
          itemheight: 6,
          icon: "circle",
          data: legendData,
          textStyle: {
            color: "#fff"
          }
        },
        color: ["#d2feff", "#2178ff", "#06fdff"],
        series: [
          {
            name: "用电类型",
            type: "pie",
            radius: ["50%", "70%"],
            center: ["50%", "45%"],
            labelLine: {
              show: true
            },
            label: {
              show: true,
              // position: "center",
              formatter: function(params) {
                return params.value + "%";
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                position: "center",
                fontWeight: "bold"
              }
            },
            itemStyle: {
              borderColor: "#3e4674",
              borderWidth: 1
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
