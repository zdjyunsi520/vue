<template>
  <div class="xl-scroll">
    <ul>
      <li @click="handleClickLeft">
        &#60;&#60;</li>
      <li @click="handleClickHome">
        首页 </li>
      <li>
        <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.native.prevent="handleScroll">
          <slot />
        </el-scrollbar>
      </li>
      <li @click.native.prevent="handleClickRight">&#62;&#62;</li>
      <li @click="handleClickDown">下箭头</li>
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
        height: 40px;
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
      height: 40px;
      line-height: 40px;
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
