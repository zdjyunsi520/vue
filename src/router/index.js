import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: true            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path*",
        component: () => import("@/views/redirect")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true
  },
  {
    path: "/findpwd",
    name: "/findpwd",
    component: () => import("@/views/login/components/UpdatePwd"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error/401"),
    hidden: true
  },
  {
    path: "/Userlarge",
    component: () => import("@/views/generalSituation/userLarge/index"),
    hidden: true
  },
  {
    path: "/Systemlarge",
    component: () => import("@/views/generalSituation/systemlarge/index"),
    hidden: true
  },
  {
    path: "/patrol/components/report",
    component: () => import("@/views/patrol/components/report"),
    hidden: true,
  },

  // {
  //   path: "",
  //   component: Layout,
  //   redirect: "index",
  //   hidden: true,
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/index"),
  //       name: "/index",
  //       meta: { title: "首页", icon: "dashboard", noCache: true, affix: false }
  //     }
  //   ]
  // },
  // {
  //   path: "generalSituation",
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: "概况", icon: "dashboard", noCache: true, affix: false },
  //   children: [
  //     {
  //       path: "/baseData",
  //       component: () => import("@/views/generalSituation/base/index"),
  //       name: "基本概况",
  //       meta: {
  //         title: "基本概况",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/powerOverview",
  //       component: () => import("@/views/generalSituation/powerOverview/index"),
  //       name: "用电概况",
  //       meta: {
  //         title: "用电概况",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/largeData",
  //       component: () => import("@/views/generalSituation/systemlarge/index"),
  //       name: "大屏展示",
  //       meta: {
  //         title: "大屏展示",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/userLargeData",
  //       component: () => import("@/views/generalSituation/userLarge/index"),
  //       name: "用电概况",
  //       meta: {
  //         title: "用电概况",
  //         noCache: true,
  //         affix: false
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "defect",
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: "缺陷管理", icon: "dashboard", noCache: true, affix: false },
  //   children: [
  //     {
  //       path: "/orderList",
  //       component: () => import("@/views/defect/orderList/index"),
  //       name: "缺陷工单",
  //       meta: {
  //         title: "缺陷工单",
  //         noCache: true,
  //         affix: false,
  //       }
  //     },
  //     {
  //       path: "/statistics",
  //       component: () => import("@/views/defect/statistics/index"),
  //       name: "缺陷统计",
  //       meta: {
  //         title: "缺陷统计",
  //         noCache: true,
  //         affix: false
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: "patrol",
  //   component: Layout,
  //   hidden: true,
  //   meta: { title: "设备巡视", icon: "dashboard", noCache: true, affix: false },
  //   children: [
  //     {
  //       path: "/PatrolCycle",
  //       component: () => import("@/views/patrol/PatrolCycle/index"),
  //       name: "巡视周期设置",
  //       meta: {
  //         title: "巡视周期设置",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/PatrolJob",
  //       component: () => import("@/views/patrol/PatrolJob/index"),
  //       name: "巡视任务单",
  //       meta: {
  //         title: "巡视任务单",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/PatrolReport",
  //       component: () => import("@/views/patrol/PatrolReport/index"),
  //       name: "巡视报告",
  //       meta: {
  //         title: "巡视报告",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/PatrolPersonnel",
  //       component: () => import("@/views/patrol/PatrolPersonnel/index"),
  //       name: "人员巡视统计",
  //       meta: {
  //         title: "人员巡视统计",
  //         noCache: true,
  //         affix: false
  //       }
  //     },
  //     {
  //       path: "/PatrolUnit",
  //       component: () => import("@/views/patrol/PatrolUnit/index"),
  //       name: "单位巡视统计",
  //       meta: {
  //         title: "单位巡视统计",
  //         noCache: true,
  //         affix: false
  //       }
  //     }
  //   ]
  // },

  {
    path: "/systemManager/organization/components",
    component: Layout,
    meta: { title: "系统管理", icon: "dashboard", noCache: true, affix: true },
    hidden: true,
    children: [
      {
        name: "/systemManager/organization/components/add",
        path: "/systemManager/organization/components/add",
        component: () =>
          import("@/views/systemManager/organization/components/add"),
        meta: {
          title: "组织机构",
          icon: "dashboard",
          noCache: true,
          affix: false,
          breadcrumb: true,
          activeMenu: '/Org/Tenant'
        }
      }
    ]
  },

  {
    path: "systemManager",
    component: Layout,
    hidden: true,
    meta: { title: "系统管理", icon: "dashboard", noCache: true, affix: false },
    children: [
      {
        name: "/commonManager/module/components/add",
        path: "/commonManager/module/components/add",
        component: () => import("@/views/commonManager/module/components/add"),
        meta: {
          title: "模块管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Module'
        }
      },
      {
        name: "/commonManager/module/components/update",
        path: "/commonManager/module/components/update",
        component: () =>
          import("@/views/commonManager/module/components/update"),
        meta: {
          title: "模块管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Module'
        }
      },
      {
        name: "/commonManager/module/components/role",
        path: "/commonManager/module/components/role",
        component: () => import("@/views/commonManager/module/components/role"),
        meta: {
          title: "模块管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Module'
        }
      },
      {
        name: "/commonManager/role/components/update",
        path: "/commonManager/role/components/update",
        component: () => import("@/views/commonManager/role/components/update"),
        meta: {
          title: "角色管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Role'
        }
      },
      {
        name: "/commonManager/user/components/add",
        path: "/commonManager/user/components/add",
        component: () => import("@/views/commonManager/user/components/add"),
        meta: {
          title: "用户管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/User'
        }
      },
      {
        name: "/commonManager/user/components/update",
        path: "/commonManager/user/components/update",
        component: () => import("@/views/commonManager/user/components/update"),
        meta: {
          title: "用户管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/User'
        }
      },
      {
        name: "/commonManager/user/components/role",
        path: "/commonManager/user/components/role",
        component: () => import("@/views/commonManager/user/components/role"),
        meta: {
          title: "用户管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/User'
        }
      },
      {
        name: "/commonManager/user/components/password",
        path: "/commonManager/user/components/password",
        component: () =>
          import("@/views/commonManager/user/components/password"),
        meta: {
          title: "用户管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/User'
        }
      },
      {
        name: "/commonManager/equipment/components/add",
        path: "/commonManager/equipment/components/add",
        component: () =>
          import("@/views/commonManager/equipment/components/add"),
        meta: {
          title: "设备管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Tool/Assets'
        }
      },
      {
        name: "/commonManager/profession/components/add",
        path: "/commonManager/profession/components/add",
        component: () =>
          import("@/views/commonManager/profession/components/add"),
        meta: {
          title: "行业管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Industry'
        }
      },
      {
        name: "/commonManager/profession/components/update",
        path: "/commonManager/profession/components/update",
        component: () =>
          import("@/views/commonManager/profession/components/update"),
        meta: {
          title: "行业管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Industry'
        }
      },
      {
        name: "/systemManager/organization/components/role",
        path: "/systemManager/organization/components/role",
        component: () =>
          import("@/views/systemManager/organization/components/role"),
        meta: {
          title: "组织结构",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Org/Tenant'
        }
      },
      {
        name: "/systemManager/user/components/add",
        path: "/systemManager/user/components/add",
        component: () => import("@/views/systemManager/user/components/add"),
        meta: {
          title: "人员信息",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Org/Employee'
        }
      },
      {
        name: "/systemManager/user/components/password",
        path: "/systemManager/user/components/password",
        component: () =>
          import("@/views/systemManager/user/components/password"),
        meta: {
          title: "人员信息",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Org/Employee'
        }
      },
      {
        name: "/systemManager/user/components/role",
        path: "/systemManager/user/components/role",
        component: () => import("@/views/systemManager/user/components/role"),
        meta: {
          title: "人员信息",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Org/Employee'
        }
      },
      {
        name: "/equipmentAccount/maintain/powerRoom/components/update",
        path: "/equipmentAccount/maintain/powerRoom/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/powerRoom/components/update"),
        meta: {
          title: "新增/编辑配电室",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/panelCabinet/components/update",
        path: "/equipmentAccount/maintain/panelCabinet/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/panelCabinet/components/update"),
        meta: {
          title: "新增/编辑屏柜",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/communicationHost/components/update",
        path: "/equipmentAccount/maintain/communicationHost/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/communicationHost/components/update"),
        meta: {
          title: "新增/编辑交流主机",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/camera/components/update",
        path: "/equipmentAccount/maintain/camera/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/camera/components/update"),
        meta: {
          title: "新增/编辑摄像头",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/smoke/components/update",
        path: "/equipmentAccount/maintain/smoke/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/smoke/components/update"),
        meta: {
          title: "新增/编辑烟感",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/interval/components/update",
        path: "/equipmentAccount/maintain/interval/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/interval/components/update"),
        meta: {
          title: "新增/编辑间隔",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/temperature/components/update",
        path: "/equipmentAccount/maintain/temperature/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/temperature/components/update"),
        meta: {
          title: "新增/编辑温感",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/equipmentAccount/maintain/clock/components/update",
        path: "/equipmentAccount/maintain/clock/components/update",
        component: () =>
          import("@/views/equipmentAccount/maintain/clock/components/update"),
        meta: {
          title: "新增/编辑电计器",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Maintain'
        }
      },
      {
        name: "/commonManager/area/components/add",
        path: "/commonManager/area/components/add",
        component: () => import("@/views/commonManager/area/components/add"),
        meta: {
          title: "新增地区",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Area'
        }
      },
      {
        name: "/commonManager/area/components/update",
        path: "/commonManager/area/components/update",
        component: () => import("@/views/commonManager/area/components/update"),
        meta: {
          title: "编辑地区",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Area'
        }
      },
      ,
      {
        name: "/runningDuty/dutyConfiguration/components/index",
        path: "/runningDuty/dutyConfiguration/components/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/components/index"),
        meta: {
          title: "值班配置",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/group/index",
        path: "/runningDuty/dutyConfiguration/group/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/group/index"),
        meta: {
          title: "班组配置",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/group/components/add",
        path: "/runningDuty/dutyConfiguration/group/components/add",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/group/components/add"),
        meta: {
          title: "+班组配置",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/job/index",
        path: "/runningDuty/dutyConfiguration/job/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/job/index"),
        meta: {
          title: "岗位",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/job/components/add",
        path: "/runningDuty/dutyConfiguration/job/components/add",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/job/components/add"),
        meta: {
          title: "岗位+",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/classTime/index",
        path: "/runningDuty/dutyConfiguration/classTime/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/classTime/index"),
        meta: {
          title: "班次",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/classTime/components/add",
        path: "/runningDuty/dutyConfiguration/classTime/components/add",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/classTime/components/add"),
        meta: {
          title: "班次+",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/classTime/components/update",
        path: "/runningDuty/dutyConfiguration/classTime/components/update",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/classTime/components/update"),
        meta: {
          title: "班次设置",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/classTime/components/index",
        path: "/runningDuty/dutyConfiguration/classTime/components/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/classTime/components/index"),
        meta: {
          title: "班次设置list",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },

      {
        name: "/runningDuty/dutyConfiguration/role1/index",
        path: "/runningDuty/dutyConfiguration/role1/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/role1/index"),
        meta: {
          title: "角色",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/role1/components/add",
        path: "/runningDuty/dutyConfiguration/role1/components/add",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/role1/components/add"),
        meta: {
          title: "角色类型+",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/role1/components/index",
        path: "/runningDuty/dutyConfiguration/role1/components/index",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/role1/components/index"),
        meta: {
          title: "角色设置list",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/runningDuty/dutyConfiguration/role1/components/update",
        path: "/runningDuty/dutyConfiguration/role1/components/update",
        component: () =>
          import("@/views/runningDuty/dutyConfiguration/role1/components/update"),
        meta: {
          title: "角色设置",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/Duty'
        }
      },
      {
        name: "/patrol/PatrolCycle/components/add",
        path: "/patrol/PatrolCycle/components/add",
        component: () => import("@/views/patrol/PatrolCycle/components/add"),
        meta: {
          title: "新增巡视周期",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/PatrolCycle'
        }
      },
      {
        name: "/patrol/PatrolJob/components/add",
        path: "/patrol/PatrolJob/components/add",
        component: () => import("@/views/patrol/PatrolJob/components/add"),
        meta: {
          title: "新增巡视任务单",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/PatrolJob'
        }
      },
      {
        name: "/defect/orderList/components/add",
        path: "/defect/orderList/components/add",
        component: () => import("@/views/defect/orderList/components/add"),
        meta: {
          title: "新增缺陷工单",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/OrderList'
        }
      },
      {
        name: "/commonManager/app/components/add",
        path: "/commonManager/app/components/add",
        component: () => import("@/views/commonManager/app/components/add"),
        meta: {
          title: "新增APP",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Tool/AppVersionInfo'
        }
      },
      {
        name: "/commonManager/settings/components/add",
        path: "/commonManager/settings/components/add",
        component: () =>
          import("@/views/commonManager/settings/components/add"),
        meta: {
          title: "新增配置管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Setting'
        }
      },
      {
        name: "/commonManager/settings/keyValue/index",
        path: "/commonManager/settings/keyValue/index",
        component: () =>
          import("@/views/commonManager/settings/keyValue/index"),
        meta: {
          title: "配置子项管理列表",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Setting'
        }
      },
      {
        name: "/commonManager/settings/keyValue/add",
        path: "/commonManager/settings/keyValue/add",
        component: () => import("@/views/commonManager/settings/keyValue/add"),
        meta: {
          title: "新增配置子项管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Setting'
        }
      },
      {
        name: "/commonManager/settings/keyValue/addMj",
        path: "/commonManager/settings/keyValue/addMj",
        component: () => import("@/views/commonManager/settings/keyValue/addMj"),
        meta: {
          title: "新增配置子项管理",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/Setting'
        }
      },
      {
        name: "/commonManager/attachment/components/add",
        path: "/commonManager/attachment/components/add",
        component: () =>
          import("@/views/commonManager/attachment/components/add"),
        meta: {
          title: "新附件分类",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Common/AttachmentType'
        }
      },
      {
        name: "/repairOrder/repair/components/add",
        path: "/repairOrder/repair/components/add",
        component: () => import("@/views/repairOrder/repair/components/add"),
        meta: {
          title: "新抢修工单",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/RepairOrder'
        }
      },
      {
        name: "/repairOrder/repair/components/repair",
        path: "/repairOrder/repair/components/repair",
        component: () => import("@/views/repairOrder/repair/components/repair"),
        meta: {
          title: "新故障抢修",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/RepairOrder'
        }
      },
      {
        name: "/repairOrder/repair/components/backFile",
        path: "/repairOrder/repair/components/backFile",
        component: () =>
          import("@/views/repairOrder/repair/components/backFile"),
        meta: {
          title: "新故障归档",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/Biz/RepairOrder'
        }
      },
      {
        name: "/defect/orderList/components/repair",
        path: "/defect/orderList/components/repair",
        component: () => import("@/views/defect/orderList/components/repair"),
        meta: {
          title: "新增消缺",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/OrderList'
        }
      },
      {
        name: "/defect/orderList/components/backFile",
        path: "/defect/orderList/components/backFile",
        component: () => import("@/views/defect/orderList/components/backFile"),
        meta: {
          title: "新增验收",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/OrderList'
        }
      },
      {
        name: "/operationMonitoring/realtimeAlarm/components/check",
        path: "/operationMonitoring/realtimeAlarm/components/check",
        component: () => import("@/views/operationMonitoring/realtimeAlarm/components/check"),
        meta: {
          title: "确认描述",
          icon: "dashboard",
          noCache: true,
          breadcrumb: true,
          activeMenu: '/RealtimeAlarm'
        }
      }
    ]
  }
];
const createRouter = () => {
  const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });
  router.onError(error => {
    const pattern = /Loading .* chunk .* failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
      router.replace(targetPath);
    }
  });
  return router;
};
const router = createRouter();

export default router;
