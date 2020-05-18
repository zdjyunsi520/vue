<template>
  <div class="xl-scroll">
    <ul>
      <li @click="handleClickLeft" style="width:38px">
        <i class="el-icon-d-arrow-left" style="font-size: 12px;font-weight: bold;"></i>
      </li>
      <li @click="handleClickHome" style="width:38px;font-size: 12px;font-weight: bold;border-left:1px solid #f6f7fa;border-right:1px solid #f6f7fa;">
        <svg-icon icon-class="home" />
      </li>
      <li>
        <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
          <slot />
        </el-scrollbar>
      </li>
      <li @click="handleClickRight" style="width:38px;border-left:1px solid #f6f7fa;border-right:1px solid #f6f7fa;">
        <i class="el-icon-d-arrow-right" style="font-size: 12px;font-weight: bold;"></i>
      </li>
      <li @click.prevent="handleClickDown" style="width:38px">
        <i class="el-icon-arrow-down" style="font-size: 12px;font-weight: bold;"></i>
      </li>
    </ul>
  </div>
</template>

<script>
const tagAndTagSpacing = 4; // tagAndTagSpacing

export default {
  name: "ScrollPane",
  data() {
    return {
      left: 0
    };
  },
  computed: {
    scrollWrapper() {
      return this.$refs.scrollContainer.$refs.wrap;
    }
  },
  methods: {
    handleClickDown(e) {
      this.$emit("openMenu", null, e, true);
    },
    handleClickHome() {
      this.$router.push({ name: "/index" });
    },
    handleClickLeft() {
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = 0;
    },
    handleClickRight() {
      const $container = this.$refs.scrollContainer.$el;
      const $scrollWrapper = this.scrollWrapper;
      const $containerWidth = $container.offsetWidth;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth;
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 40;
      const $scrollWrapper = this.scrollWrapper;
      $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;
    },
    moveToTarget(currentTag) {
      const $container = this.$refs.scrollContainer.$el;
      const $containerWidth = $container.offsetWidth;
      const $scrollWrapper = this.scrollWrapper;
      const tagList = this.$parent.$refs.tag;

      let firstTag = null;
      let lastTag = null;

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0];
        lastTag = tagList[tagList.length - 1];
      }

      if (firstTag === currentTag) {
        $scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentTag) {
        $scrollWrapper.scrollLeft =
          $scrollWrapper.scrollWidth - $containerWidth;
      } else {
        // find preTag and nextTag
        const currentIndex = tagList.findIndex(item => item === currentTag);
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];

        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing;

        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft =
          prevTag.$el.offsetLeft - tagAndTagSpacing;

        if (
          afterNextTagOffsetLeft >
          $scrollWrapper.scrollLeft + $containerWidth
        ) {
          $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth;
        } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
          $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.xl-scroll {
  .el-scrollbar {
    padding: 0;
  }
  .scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    /deep/ {
      .el-scrollbar__bar {
        bottom: 0px;
      }
      .el-scrollbar__wrap {
        height: 36px;
        overflow: hidden;
      }
    }
  }
  width: 100%;
  ul {
    padding: 0;
    margin: 0;
    display: flex;
    li {
      height: 36px;
      line-height: 36px;
      width: 50px;
      text-align: center;
      display: block;
      cursor: pointer;

      &:nth-of-type(3) {
        flex-grow: 1;
        width: calc(100% - 100px);
        cursor: auto;
        text-align: left;
      }
      list-style-type: none;
    }
  }
}
</style>
