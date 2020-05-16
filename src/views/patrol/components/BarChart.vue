<template>
  <div :class="className"  :style="{height:height,width:width}" />
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
    },
   
    chartData:{
      type:Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
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
        deep: true ,//对象内部属性的监听，关键。
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
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions(this.chartData);
    },
    setOptions({ title, xAxisData,listData } = {}) {
      this.chart.setOption({
        title:{
          text: title,
          left:'5px',
          top:'20px',
          textStyle:{
            fontSize:16,
            fontWeight:'bold',
            color:'#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          top:'60px',
          left: '30px',
          right: '30px',
          bottom: '20px',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          axisTick: {
            alignWithLabel: true
          },
          axisLine:{
            lineStyle:{
              color:'#909399'
            }
          },
           splitLine:{
             show:true
           }
        }],
        yAxis: [{
          type: 'value',
          axisLine:{
            lineStyle:{
              color:'#909399'
            }
          }
        }],
        color:['#558cf7'],
        series: [{
          name: '巡视',
          type: 'bar',
          // stack: 'vistors',
          barWidth: '50',
          data: listData,
        }]
      })
    }
  }
}
</script>
