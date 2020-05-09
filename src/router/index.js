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
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
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
    path: "",
    component: Layout,
    redirect: "index",
    children: [
      {
        path: "index",
        component: () => import("@/views/index"),
        name: "首页",
        meta: { title: "首页", icon: "dashboard", noCache: true, affix: false }
      }
    ]
  },
  {
    path: "generalSituation",
    component: Layout,
    hidden: true,
    meta: { title: "概况", icon: "dashboard", noCache: true, affix: false },
    children: [
      {
        path: "/baseData",
        component: () => import("@/views/generalSituation/base/index"),
        name: "基本概况",
        meta: {
          title: "基本概况",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/largeData",
        component: () => import("@/views/generalSituation/large/index"),
        name: "大屏展示",
        meta: {
          title: "大屏展示",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/userLargeData",
        component: () => import("@/views/generalSituation/userLarge/index"),
        name: "用户大屏",
        meta: {
          title: "用户大屏",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      }
    ]
  },
  {
    path: "defect",
    component: Layout,
    meta: { title: "缺陷管理", icon: "dashboard", noCache: true, affix: false },
    children: [{
        path: "/orderList",
        component: () =>
            import ("@/views/defect/orderList/index"),
        name: "缺陷工单",
        meta: {
            title: "缺陷工单",
            icon: "dashboard",
            noCache: true,
            affix: false
        }
    }, {
        path: "/statistics",
        component: () =>
            import ("@/views/defect/statistics/index"),
        name: "缺陷统计",
        meta: {
            title: "缺陷统计",
            icon: "dashboard",
            noCache: true,
            affix: false
        }
    }]
},
  {
    path: "equipmentAccount",
    component: Layout,
    hidden: true,
    meta: { title: "设备台账", icon: "dashboard", noCache: true, affix: false },
    children: [
      {
        path: "/curriculumVitae",
        component: () =>
          import("@/views/equipmentAccount/curriculumVitae/index"),
        name: "设备履历",
        meta: {
          title: "设备履历",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/maintain",
        component: () => import("@/views/equipmentAccount/maintain/index"),
        name: "设备维护",
        meta: {
          title: "设备维护",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/monitor",
        component: () => import("@/views/equipmentAccount/monitor/index"),
        name: "监控信息",
        meta: {
          title: "监控信息",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      }
    ]
  },
  {
    path: "patrol",
    component: Layout,
    hidden: true,
    meta: { title: "设备巡视", icon: "dashboard", noCache: true, affix: false },
    children: [
      {
        path: "/PatrolCycle",
        component: () => import("@/views/patrol/PatrolCycle/index"),
        name: "巡视周期设置",
        meta: {
          title: "巡视周期设置",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/PatrolJob",
        component: () => import("@/views/patrol/PatrolJob/index"),
        name: "巡视任务单",
        meta: {
          title: "巡视任务单",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/PatrolReport",
        component: () => import("@/views/patrol/PatrolReport/index"),
        name: "巡视报告",
        meta: {
          title: "巡视报告",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/PatrolPersonnel",
        component: () => import("@/views/patrol/PatrolPersonnel/index"),
        name: "人员巡视统计",
        meta: {
          title: "人员巡视统计",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/PatrolUnit",
        component: () => import("@/views/patrol/PatrolUnit/index"),
        name: "单位巡视统计",
        meta: {
          title: "单位巡视统计",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      }
    ]
  },
  {
    path: "commonManager",
    component: Layout,
    meta: { title: "通用管理", icon: "dashboard", noCache: true, affix: false },
    children: [
      {
        path: "/module",
        component: () => import("@/views/commonManager/module/index"),
        name: "模块管理",
        meta: {
          title: "模块管理",
          icon: "dashboard",
          noCache: true,
          affix: true
        }
      },
      {
        path: "/role",
        component: () => import("@/views/commonManager/role/index"),
        name: "角色管理",
        meta: {
          title: "角色管理",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/user",
        component: () => import("@/views/commonManager/user/index"),
        name: "用户信息",
        meta: {
          title: "用户信息",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/equipment",
        component: () => import("@/views/commonManager/equipment/index"),
        name: "设备资产",
        meta: {
          title: "设备资产",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      },
      {
        path: "/area",
        component: () => import("@/views/commonManager/area/index"),
        name: "地区管理",
        meta: {
          title: "地区管理",
          icon: "dashboard",
          noCache: true,
          affix: false
        }
      }
    ]
  }

  // {
  //   path: "systemManager",
  //   component: Layout,
  //   meta: { title: "系统管理", icon: "dashboard", noCache: true, affix: false },
  //   children: [
  //     {
  //       path: "/module",
  //       component: () => import("@/views/systemManager/organization/index"),
  //       name: "组织机构",
  //       meta: {
  //         title: "组织机构",
  //         icon: "dashboard",
  //         noCache: true,
  //         affix: true
  //       }
  //     }
  //   ]
  // }
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
