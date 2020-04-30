<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/views/dashboard/mixins/resize'

const animationDuration = 500

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },

  beforeDestroy() {
   this.destroy()
  },
  methods: {
      destroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
    initChart(name,series) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },

        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: name,
          nameTextStyle:{
            width:'100px',
            color:'#f00'
          },
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
        //   axisTick: {
        //     show: false
        //   }
        }],
        series
      })
    }
  }
}
</script>
