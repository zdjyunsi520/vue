<template>
  <el-row class="xl-font-size">

  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "countView",
  data() {
    return {};
  },
  created() {
    // this.handleRefresh()
  },
  activated() {
    //  this.handleRefresh()
  },
  computed: {
    ...mapState(["common"]),
    bBuyerAccountInfo() {
      return (
        this.common.count.bBindPddAccountInfo +
        this.common.count.bBindTbAccountInfo +
        this.common.count.bBindJdAccountInfo
      );
    }
  },
  methods: {
    ...mapActions({ reflash: "common/refresh" }),
    handleRefresh() {
      this.reflash();
    },
    handleSetLineChartData(type) {
      if (type == "/buyer/account/all") {
        if (this.common.count.bBindTbAccountInfo > 0) {
          type = "/buyer/account/tb";
        } else if (this.common.count.bBindJdAccountInfo > 0) {
          type = "/buyer/account/jd";
        } else if (this.common.count.bBindPddAccountInfo > 0) {
          type = "/buyer/account/pdd";
        }
      }
      this.$router.push({ path: type, params: { query: Math.random() } });
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-font-size {
  color: #606266;
  font-size: 14px;
  font-weight: 400;
  /deep/.el-col {
    display: inline-block;
    margin: 10px 0 10px 10px;
    float: none;
    width: auto;
    span {
      color: #f00;
      cursor: pointer;
    }
  }
}
</style>