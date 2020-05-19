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
    }
  },
  data() {
    return {
      chart: null
    };
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

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          show: true,
          right: "1%",
          bottom: "10",
          orient: "vertical",
          data: [
            "分闸",
            "越上上限",
            "越下限",
            "越上限",
            "超温",
            "工况异常",
            "告警",
            "过压"
          ]
        },

        color: ["#333", "#444", "#555", "#666", "#777", "#888", "#aaa", "#bbb"],
        series: [
          {
            name: "告警情况",
            type: "pie",
              label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            radius: ["45%", "75%"],
            center: ["45%", "50%"],
            data: [
              {
                value: 21,
                name: "分闸"
              },
              {
                value: 34,
                name: "越上上限"
              },
              {
                value: 43,
                name: "越下限"
              },
              {
                value: 26,
                name: "越上限"
              },
              {
                value: 17,
                name: "超温"
              },
              {
                value: 12,
                name: "工况异常"
              },
              {
                value: 22,
                name: "告警"
              },
              {
                value: 12,
                name: "过压"
              }
            ]
          }
        ]
      });
    }
  }
};
</script>
