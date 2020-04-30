<template>
  <el-row>
    <el-tabs class="xl-container" @tab-click="handleClickTabs">
      <el-tab-pane label="淘宝价格配置">
      </el-tab-pane>
      <el-tab-pane label="京东价格配置">
      </el-tab-pane>
      <el-tab-pane label="拼多多价格配置">
      </el-tab-pane>

    </el-tabs>
    <component :is="componentId" ref="component"></component>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      tabsIndex: 0
    };
  },
  computed: {
    componentId() {
      if (this.tabsIndex == 0) {
        setTimeout(() => {
          this.$refs.component.platformType = 1;
          this.$refs.component.getList();
        }, 100);
        return () => import('./list');
      } else if (this.tabsIndex == 1) {
        setTimeout(() => {
          this.$refs.component.platformType = 3;
          this.$refs.component.getList();
        }, 100);
        return () => import('./list');
      } else if (this.tabsIndex == 2) {
        setTimeout(() => {
          this.$refs.component.platformType = 2;
          this.$refs.component.getList();
        }, 100);
        return () => import('./list');
      }
    }
  },
  methods: {
    handleClickTabs({ index }) {
      this.tabsIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>