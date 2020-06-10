<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->

        <div class="right-menu">
            <!-- <el-breadcrumb separator="|">
        <el-breadcrumb-item>欢迎您：{{name}}</el-breadcrumb-item>
        <el-breadcrumb-item><span class="link-type" @click="logout">登出</span></el-breadcrumb-item>
        <el-breadcrumb-item><span class="xl-hand" @click="handleOpen('updatePwd')">编辑密码</span></el-breadcrumb-item>
      <el-breadcrumb-item><span class="xl-hand" @click="handleOpen('updatePwd')">编辑密码</span></el-breadcrumb-item>
      </el-breadcrumb> -->
            <!-- <update-pwd ref="updatePwd"></update-pwd> -->
            <template v-if="device!=='mobile'">
                <!-- <search id="header-search" class="right-menu-item" /> -->

                <div class="right-menu-item hover-effect">
                    <span style="position:relative">
                        <el-badge is-dot class="item" style="display: inline;">
                            <svg-icon icon-class="news" style="font-size: 25px;vertical-align: -0.3em;" />
                            <!-- <el-button class="share-button" icon="el-icon-share" type="primary"></el-button> -->
                        </el-badge>
                    </span>
                </div>

                <div class="right-menu-item hover-effect">
                    <svg-icon icon-class="nav_colour" style="font-size: 18px;vertical-align: middle;" />
                </div>

                <screenfull id="screenfull" class="right-menu-item hover-effect" style="font-size: 20px; padding: 0;" />

                <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->

            </template>

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar1" v-if="avatar1" class="user-avatar">
                    <span>{{name}}</span>
                    <i class="el-icon-caret-bottom" style="margin-left: 8px;" />
                </div>
                <el-dropdown-menu slot="dropdown">
                    <!-- <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="setting = true">布局设置</span>
          </el-dropdown-item> -->
                    <router-link :to="{name:'/commonManager/user/components/password',params:{fromurl:$route.name}}">
                        <el-dropdown-item>
                            <span class="xl-login-out-span">修改密码</span>
                        </el-dropdown-item>
                    </router-link>
                    <el-dropdown-item>
                        <span class="xl-login-out-span" @click="logout">退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
// import Search from '@/components/HeaderSearch';
import Ku from "@/components/Ku";
import UpdatePwd from "@/views/login/components/UpdatePwd";
export default {
    components: {
        Breadcrumb,
        Hamburger,
        Screenfull,
        SizeSelect,
        // Search,
        Ku,
        UpdatePwd
    },
    data() {
        return {
            avatar1: require("../../assets/image/photo.jpg")
        };
    },
    computed: {
        ...mapGetters(["sidebar", "avatar", "device", "name"]),
        setting: {
            get() {
                return this.$store.state.settings.showSettings;
            },
            set(val) {
                this.$store.dispatch("settings/changeSetting", {
                    key: "showSettings",
                    value: val
                });
            }
        }
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch("app/toggleSideBar");
        },
        async logout() {
            this.$confirm("确定注销并退出系统吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.$store.dispatch("LogOut").then(() => {
                    location.reload();
                });
            });
        },
        handleOpen(ref) {
            this.$refs[ref].dialogVisible = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background 0.3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, 0.025);
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;
        .el-breadcrumb {
            height: 100%;
            line-height: 50px;
            padding-right: 20px;
        }
        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 4px;
            height: 100%;
            font-size: 14px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background 0.3s;

                &:hover {
                    background: rgba(0, 0, 0, 0.025);
                }
            }
        }

        .avatar-container {
            margin-right: 12px;

            .avatar-wrapper {
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 30px;
                    height: 30px;
                    vertical-align: middle;
                    margin-right: 10px;
                    margin-left: 10px;
                    border-radius: 100%;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    font-size: 16px;
                }
            }
        }
    }
}
.xl-hand {
    cursor: pointer;
    a {
        color: #bbb;
        &:hover {
            text-decoration: none;
            color: #1890ff;
        }
    }
    &:hover {
        color: #1890ff;
    }
}
.xl-login-out-span {
    display: block;
    width: 100%;
    height: 100%;
}
</style>
