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
          left: "40px",
          top: "30px",
          itemWidth: 6,
          itemHeight: 6,
          icon: "circle",
          textStyle: {
            color: "#909399"
          },
          orient: "vertical",
          data: [
            "越上上限",
            "分闸",
            "越下限",
            "告警",
            "工况异常",
            "超温",
            "越上限",
            "过压"
          ]
        },

        color: [
          "#4982f7",
          "#588ef7",
          "#91c5f3",
          "#badbf4",
          "#e8a4458",
          "#ebbc8a",
          "#f8d687",
          "#fbe8bf"
        ],
        series: [
          {
            name: "告警情况",
            type: "pie",
            roseType: "radius",
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                formatter: "{d}次\n{b}"
              }
            },
            labelLine: {
              show: false
            },
            radius: ["35%", "100%"],
            center: ["55%", "40%"],
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
