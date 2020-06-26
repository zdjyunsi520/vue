<template>
  <!-- <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="filterIcons" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div> -->
  <div class="icon-body">
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)" :class="name == item?'on':''">
        <svg-icon :icon-class="item" />
        <b>{{ iconNameList[index] }}</b>
      </div>
    </div>
  </div>
</template>

<script>
import icons from "./requireIcons";
export default {
  name: "IconSelect",
  data() {
    return {
      name: "",
      iconList: icons,
      iconNameList: [
        "会员资料",
        "地球",
        "数据",
        "计算机",
        "分析",
        "制造",
        "分类",
        "分析数据",
        "日期",
        "工业",
        "走势",
        "模块化",
        "人员",
        "印章",
        "云服务",
        "云服务2",
        "链接",
        "智能云",
        "智能文件",
        "信息化",
        "24小时服务",
        "信息认证",
        "企业资源",
        "文件",
        "走势",
        "招标",
        "对接成功",
        "日期2",
        "合作企业",
        "详细分类",
        "计算机监控",
        "收藏文件",
        "编辑信息",
        "个人中心",
        "设置",
        "文件",
        "云服务",
        "数据分析",
        "风险安全",
        "获取利息",
        "开发",
        "定位流程",
        "搜集资料",
        "智能安全",
        "人工智能",
        "产品",
        "布局",
        "修理调整",
        "联网结构",
        "开发2",
        "云",
        "结构空间"
      ]
    };
  },

  methods: {
    filterIcons() {
      if (this.name) {
        this.iconList = this.iconList.filter(item => item.includes(this.name));
      } else {
        this.iconList = icons;
      }
    },
    selectedIcon1(name) {
      this.$emit("selected", name);
      document.body.click();
    },
    selectedIcon(name) {
      this.name = name;
      this.$emit("selected", name);
    },
    reset() {
      this.name = "";
      this.iconList = icons;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 800px;
  .icon-list {
    // height: 200px;
    // overflow-y: scroll;
    div {
      height: 66px;
      cursor: pointer;
      width: 66px;
      padding: 10px 0;
      &.on {
        color: #006eff;
        border-color: #558cf7;
        background-color: #f1f6ff;
      }
      box-shadow: 0px 0px 4px 0px #e6efff;
      text-align: center;
      position: relative;
      border: 1px solid #ececec;
      border-radius: 2px;
      margin: 0px 14px 7px 0px;
      display: inline-block;
      color: #999999;
    }
    b {
      display: block;
      font-size: 12px;
      font-weight: normal;
      line-height: 5px;
    }
    svg {
      width: 24px;
      height: 24px;
    }
  }
}
</style>
