<template>
  <div class="app-container">
   <div>
       {{dataInfo}}
   </div>
  </div>
</template>

<script>
import { getReportInfo } from "@/api/patrol";
export default {
  data() {
    return {
        jobid:'',
        dataInfo: {},
    
    };
  },
  created() {
    let { jobid } = this.$route.query;
    this.jobid = jobid;
    console.log(1111,this.jobid)
    this.getReportInfo(this.jobid);
    // if (data && data.Id) {
    //   this.getInfoJob(data);
    // } else {
    //   this.reset(data);
    // }
  },
  methods: {
    // 巡视人员
    getReportInfo(id) {
        const jobid = id;
      getReportInfo({jobid})
        .then(res => {
          this.dataInfo = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
  
  }
};
</script>

<style lang="scss" scoped>
</style>