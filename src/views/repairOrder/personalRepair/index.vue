<template>
  <div class="app-container">
    <div class="search-box xl-querybox " style='padding-top:15px'>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="按年度统计" name="0"></el-tab-pane>
        <el-tab-pane label="按业务来源统计" name="1"></el-tab-pane>
        <el-tab-pane label="按完成情况统计" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <year v-if="activeName==0"></year>
    <bysource v-if="activeName==1"></bysource>
    <bycomplete v-if="activeName==2"></bycomplete>
  </div>
</template>

<script>
import year from "./components/year";
import bysource from "./components/bysource";
import bycomplete from "./components/bycomplete";
export default {
  components: {
    year,
    bysource,
    bycomplete
  },
  data() {
    return {
      activeName: "0"
    };
  },

  created() {},
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style lang="scss" scoped>
.xl-querybox {
  border-bottom: none;
  margin-bottom: -15px;
}
/deep/.smchartbox {
  margin-bottom: 15px;
}



</style>