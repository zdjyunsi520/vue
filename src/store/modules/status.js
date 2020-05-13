import { getSelectList } from "@/api/systemManager/organization";

const state = {
  equipmentType: [
    { key: 1, value: "通讯主机" },
    { key: 2, value: "电力表计" },
    { key: 3, value: "温控" },
    { key: 4, value: "烟感" },
    { key: 5, value: "摄像头" }
  ],
  equipmentKV: null,
  //资产属性
  assetAttributeType: [
    { key: 1, value: "用户资产" },
    { key: 2, value: "局方资产" }
  ],
  assetAttributeKV: null,
  //配电室类型
  powerRoomType: [
    { key: 1, value: "高压配电室" },
    { key: 2, value: "配电器室" },
    { key: 3, value: "低压配电室" }
  ],
  powerRoomKV: null,
  //电压等级
  voltageLevelType: [
    { key: "交流220V", value: "交流220V" },
    { key: "交流380V", value: "交流380V" },
    { key: "交流400V", value: "交流400V" },
    { key: "交流6kV", value: "交流6kV" },
    { key: "交流10kV", value: "交流10kV" },
    { key: "交流20kV", value: "交流20kV" },
    { key: "交流35kV", value: "交流35kV" },
    { key: "交流110kV", value: "交流110kV" }
  ],
  voltageLevelKV: null,
  //运行状态
  runningStateType: [{ key: 1, value: "在运" }, { key: 0, value: "停运" }],
  runningStateKV: null,
  //用电单位列表（用于下拉框）
  companyType: null,
  companyKV: null,
  //屏柜类型
  panelCabinetType: [
    { key: "中央控制屏", value: "中央控制屏" },
    { key: "保护屏", value: "保护屏" },
    { key: "故障录波屏", value: "故障录波屏" },
    { key: "测控屏", value: "测控屏" },
    { key: "远东屏", value: "远东屏" },
    { key: "直流屏", value: "直流屏" },
    { key: "站用电屏", value: "站用电屏" },
    { key: "UPS屏", value: "UPS屏" },
    { key: "计量屏", value: "计量屏" },
    { key: "公用屏", value: "公用屏" }
  ],
  panelCabinetKV: null
};

const mutations = {
  SET_DEPT: (state, data) => {
    state.deptType = data;
  }
};

const actions = {
  getDept: ({ commit }) => {
    return new Promise((resolve, reject) => {
      fetchDept()
        .then(({ data }) => {
          commit("SET_DEPT", data);
          resolve(data);
        })
        .error(e => {
          reject(e);
        });
    });
  }
};

function reduceKV(list) {
  return list.reduce((l, v) => {
    l[v.key] = v.value;
    return l;
  }, {});
}
const getters = {
  equipmentType: state => state.equipmentType,
  equipmentKV: state => {
    state.equipmentKV || (state.equipmentKV = reduceKV(state.equipmentType));
    return state.equipmentKV;
  },
  assetAttributeType: state => state.assetAttributeType,
  assetAttributeKV: state => {
    state.assetAttributeKV ||
      (state.assetAttributeKV = reduceKV(state.assetAttributeType));
    return state.assetAttributeKV;
  },
  powerRoomType: state => state.powerRoomType,
  powerRoomKV: state => {
    state.powerRoomKV || (state.equipmentKV = reduceKV(state.powerRoomType));
    return state.powerRoomKV;
  },
  voltageLevelType: state => state.voltageLevelType,
  voltageLevelKV: state => {
    state.voltageLevelKV ||
      (state.voltageLevelKV = reduceKV(state.voltageLevelType));
    return state.voltageLevelKV;
  },
  runningStateType: state => state.runningStateType,
  runningStateKV: state => {
    state.runningStateKV ||
      (state.runningStateKV = reduceKV(state.runningStateType));
    return state.runningStateKV;
  },
  companyType: state => {
    state.companyType ||
      getSelectList({}).then(r => {
        state.companyType = r.data.map(v => {
          const key = v.Id;
          const value = v.Name;
          return { key, value };
        });
        state.companyKV = reduceKV(state.companyType);
      });
    return state.companyType;
  },
  companyKV: state => {
    state.companyKV ||
      getSelectList({}).then(r => {
        state.companyType = r.data.map(v => {
          const key = v.Id;
          const value = v.Name;
          return { key, value };
        });
        state.companyKV = reduceKV(state.companyType);
      });
    return state.companyKV;
  },
  panelCabinetType: state => state.panelCabinetType,
  panelCabinetKV: state => {
    state.panelCabinetKV ||
      (state.panelCabinetKV = reduceKV(state.panelCabinetType));
    return state.panelCabinetKV;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
