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
            iconList: icons
        };
    },

    methods: {
        filterIcons() {
            if (this.name) {
                this.iconList = this.iconList.filter(item =>
                    item.includes(this.name)
                );
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
    width: 100%;
    .icon-list {
        // height: 200px;
        // overflow-y: scroll;
        div {
            height: 60px;
            cursor: pointer;
            width: 60px;
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
            display:inline-block;
            color: #999999;
        }
        span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
        }
        svg {
            width: 30px;
            height: 30px;
            top: 50%;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
