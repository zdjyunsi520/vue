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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}户 ({d}%)'
        },
        legend: {
          show:true,
          right: '0',
          bottom: '10',
          data: ['商业', '工业', '居民']
        },
        label:{
          formatter: '{b} : {d}%',
        },
        color : [ '#555', '#777', '#999' ],
        series: [
          {
            name: '用电统计',
            type: 'pie',
            radius:['30%', '50%'],
            center: ['50%', '50%'],
            emphasis: {
              itemStyle:{
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowBlur: 10,
              }
            },
            data: [
              { value: 320, name: '商业' },
              { value: 240, name: '工业' },
              { value: 149, name: '居民' },
            ],
           
          }
        ],
       
      })
    }
  }
}
</script>
