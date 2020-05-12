import { login, logout, getInfo, getInfo1 } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
  state: {
    token: getToken(),
    name: "",
    avatar: "",
    roles: [],
    permissions: [],
    deptId: "",
    userName: "",
    deptName: "",
    deptLogo: "",
    deptCommisionRate: 0
  },
  //处理数据逻辑方法全部放在mutations里面 动态变量
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions;
    }
  },

  //Action提交的是Mutation，不能够直接修改state中的状态，而Mutations是可以直接修改state中状态的；
  //Action是支持异步操作的，而Mutations只能是同步操作。
  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log(userInfo);
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            setToken(res.token);
            commit("SET_TOKEN", res.token);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      //实例化一个异步请求对象
      return new Promise((resolve, reject) => {
        getInfo1().then(r => {
          console.log;
        });
        getInfo()
          .then(res => {
            console.log(res);
            // const user = res.data.user;
            // const avatar =
            //   user.avatar == ""
            //     ? require("@/assets/image/profile.jpg")
            //     : process.env.VUE_APP_BASE_API + user.avatar;
            // if (res.data.roles && res.data.roles.length > 0) {
            //   // 验证返回的roles是否是一个非空数组
            //   commit("SET_ROLES", res.data.roles);
            //   commit("SET_PERMISSIONS", res.data.permissions);
            // } else {
            //   commit("SET_ROLES", ["ROLE_DEFAULT"]);
            // }
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
            //  commit("SET_NAME", user.nickName);
            //  commit("SET_AVATAR", avatar);
            // state.deptId = user.deptId;
            //  state.deptLogo = res.data.deptLogo;
            //  state.deptName = res.data.deptName;
            //state.userName = user.userName;
            console.log("GetInfo", res);
            resolve(res);
          })
          .catch(error => {
            reject(error);
            return;
            commit("SET_ROLES", ["ROLE_DEFAULT"]);
            var res = {};
            res.data = [];
            resolve(res);
          });
      });
    },

    // 退出系统
    // LogOut({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     logout(state.token)
    //       .then(() => {
    //         commit("SET_TOKEN", "");
    //         commit("SET_ROLES", []);
    //         commit("SET_PERMISSIONS", []);
    //         removeToken();
    //         resolve();
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        commit("SET_PERMISSIONS", []);
        removeToken();
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      //实例化一个请求方式
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};

export default user;
