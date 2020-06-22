<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <!-- <img v-if="smlogo" :src="smlogo" class="sidebar-logo"> -->
        <svg-icon icon-class="logo" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <svg-icon icon-class="logo1" class="sidebar-logo" />

        <!-- <img v-if="logo" :src="logo" class="sidebar-logo"> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
import logoImg from "@/assets/logo/logo.png";
import { mapGetters, mapState } from "vuex";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: "迅腾电力",
      logo: require("@/assets/logo/logo.png"),
      smlogo: require("@/assets/logo/smlogo.png")
    };
  },
  computed: {
    ...mapGetters({ path: "imgOSS/path" }),
    ...mapState(["user"])
    // logo() {
    //    const path = this.user.deptLogo?(this.path+this.user.deptLogo):''
    //   return path
    //   return this.path + (this.user.deptLogo||'mer/task/1576839114202.2456.png');
    // },
    // title(){
    //   return this.user.deptName || '迅腾电力'
    // }
  }
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #558cf7;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      vertical-align: middle;
      width: 180px;
      height: 45px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      width: 28px;
      margin-right: 0px;
      height: 31px;
    }
  }
}
</style>
