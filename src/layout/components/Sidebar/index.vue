<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" >
.el-submenu .el-menu-item{
  height: 40px;
  line-height: 40px;
  padding-left: 55px!important;
}
.el-submenu .el-icon-arrow-down:before {
    content: "";
    background: url(../../../assets/image/ic_arrow_down.png) no-repeat;
    width: 10px;
    height: 6px;
    display: inline-block;
}

 .el-submenu__icon-arrow {
     right: 45px!important;
 }
.el-submenu {
  &.is-opened{
    .el-submenu__title{
      position: relative;background-color: #222836!important;
      &::before{
      content: '';
      height: 100%;width: 6px;background: #558cf7;position: absolute;left: 0
      }
    }
  }
  .el-submenu__title{
      padding-left: 30px!important;
  }
}
</style>
