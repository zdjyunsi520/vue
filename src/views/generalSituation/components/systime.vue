<template>
  <span class="timebox">{{systime1}}</span>
</template>


<script>
export default {
  name: "systime",
  data() {
    return {
      sysWeekday: "",
      systime1: "",
      systime2: ""
    };
  },
  created() {
    this.setsysTime();
    // 系统时间
    setInterval(() => {
      this.setsysTime();
    }, 1000);
  },
  methods: {
    //判断是否在前面加0
    getNow(s) {
      return s < 10 ? "0" + s : s;
    },
    setsysTime() {
      var timeval = this.getNowTime();
      this.systime1 = this.getNowTime();
      // var tt = timeval.split("/");
      // this.systime1 = tt[0];
      // this.systime2 = tt[1];
    },
    // 获取系统时间
    getNowTime() {
      var myDate = new Date();
      var year = myDate.getFullYear(); //获取当前年
      var month = myDate.getMonth() + 1; //获取当前月
      var date = myDate.getDate(); //获取当前日
      var h = myDate.getHours(); //获取当前小时数(0-23)
      var m = myDate.getMinutes(); //获取当前分钟数(0-59)
      var s = myDate.getSeconds();
      var now =
        year +
        "-" +
        this.getNow(month) +
        "-" +
        this.getNow(date) +
        " " +
        this.getNow(h) +
        ":" +
        this.getNow(m) +
        ":" +
        this.getNow(s);
      return now;
    }
  }
};
</script>

<style scoped>
.timebox {
  text-align: center;
  /* color: #333; */
  /* border-radius: 51px; */
  /* border: 0.3rem solid #df0615; */
  /* margin: 3rem 12% 0; */
  /* padding: 1.5rem; */
  /* font-size: 2.5rem; */
}

.timebox label {
  padding: 0 1rem;
  font-weight: normal;
}
</style>