<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

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
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title:{
          text: 'aaa-按年度统计',
          left:'5px',
          textStyle:{
            fontSize:14,
            color:'#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top:'40px',
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          axisTick: {
            alignWithLabel: true
          },
          axisLine:{
            lineStyle:{
              color:'#666'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          axisLine:{
            lineStyle:{
              color:'#666'
            }
          }
        }],
        color:['#999'],
        series: [{
          name: 'pageA',
          type: 'bar',
          // stack: 'vistors',
          barWidth: '60%',
          data: [79, 52, 200, 334, 390, 330, 220, 200, 334, 390, 330, 220],
        }]
      })
    }
  }
}
</script>
