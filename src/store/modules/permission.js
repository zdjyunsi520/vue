import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import store from "@/store";
const permission = {
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    }
  },
  actions: {
    // 生成路由
    // GenerateRoutes({ commit }) {
    //   return new Promise(resolve => {
    //     // 向后端请求路由数据
    //     getRouters().then(res => {
    //       const accessedRoutes = filterAsyncRouter(res.data);
    //       commit("SET_ROUTES", accessedRoutes);
    //       resolve(accessedRoutes);
    //     });
    //   });
    // }
    GenerateRoutes({ commit }, res) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        const data = [];
        mapRouter(data, res.data);
        let IconUrl;
        let Component = "";
        let Name = "index";
        if (res.data && res.data.length) {
          IconUrl = res.data[0].IconUrl;
          if (res.data[0].Childs && res.data[0].Childs.length) {
            Component = res.data[0].Childs[0].Component;
            Name = res.data[0].Childs[0].Url;
          }
          store.dispatch("SetHome", { IconUrl, Component });
        }
        const accessedRoutes = filterAsyncRouter(data);
        accessedRoutes.push({ path: "/", redirect: Name, hidden: true });
        // accessedRoutes.push({
        //   path: "/index",
        //   redirect: Component,
        //   hidden: true
        // });
        console.log(accessedRoutes);
        commit("SET_ROUTES", accessedRoutes);
        resolve(accessedRoutes);
      });
    }
  }
};
function mapRouter(parent, data) {
  data.forEach(v => {
    const component = v.Component ? v.Component : "";
    const node = {
      name: component,
      component,
      path: v.Url,
      meta: {
        title: v.Name,
        icon: v.IconUrl
      },
      children: []
    };

    if (v.Childs) {
      mapRouter(node.children, v.Childs);
    }
    parent.push(node);
  });
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    // Layout组件特殊处理
    if (route.component === "") {
      route.component = Layout;
    } else {
      route.component = loadView(route.component);
    }

    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
}

// export const loadView = view => {
//   // 路由懒加载
//   return () => import(`@/views${view}`);
// };

export const loadView = view => {
  return resolve => {
    require.ensure([], require => {
      resolve(require("@/views" + view + ".vue"));
    });
  };
};

export default permission;
