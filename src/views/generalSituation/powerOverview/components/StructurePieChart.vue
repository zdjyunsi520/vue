<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '197px'
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          show:true,
          right: '5%',
          bottom:'20%',
          orient:'vertical',
          data: ['尖峰', '高峰', '平时','低谷']
        },
        color : [ '#555', '#777', '#999','#bbb' ],
        series: [
          {
            name: '用电结构',
            type: 'pie',
            radius:'80%',
            center: ['50%', '50%'],
            emphasis: {
              itemStyle:{
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
              }
            },
            data: [
              { value: 320, name: '尖峰' },
              { value: 240, name: '高峰' },
              { value: 149, name: '平时' },
              { value: 32, name: '低谷' },
            ],
            labelLine:{
              show:false
            },
            label:{
              show:false,
            },
           
          }
        ],
       
      })
    }
  }
}
</script>
