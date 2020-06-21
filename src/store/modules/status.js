import { getSelectList } from "@/api/systemManager/organization";
import { getCommunicateList } from "@/api/equipmentAccount/maintain/communicationHost";
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
        { key: 2, value: "变压器室" },
        { key: 3, value: "低压配电室" }
    ],
    powerRoomKV: null,
    //电压等级
    voltageLevelType: [
        { key: 1, value: "交流220V" },
        { key: 2, value: "交流380V" },
        { key: 3, value: "交流400V" },
        { key: 4, value: "交流6kV" },
        { key: 5, value: "交流10kV" },
        { key: 6, value: "交流20kV" },
        { key: 7, value: "交流35kV" },
        { key: 8, value: "交流110kV" }
    ],
    voltageLevelKV: null,
    //运行状态
    runningStateType: [
        { key: true, value: "在运" },
        { key: false, value: "停运" }
    ],
    runningStateKV: null,
    //用电单位列表（用于下拉框）
    companyType: null,
    companyKV: null,
    //屏柜类型
    panelCabinetType: [
        { key: 1, value: "中央控制屏" },
        { key: 2, value: "保护屏" },
        { key: 3, value: "故障录波屏" },
        { key: 4, value: "测控屏" },
        { key: 5, value: "远动屏" },
        { key: 6, value: "直流屏" },
        { key: 7, value: "站用电屏" },
        { key: 8, value: "UPS屏" },
        { key: 9, value: "计量屏" },
        { key: 10, value: "公用屏" }
    ],
    panelCabinetKV: null,
    intervalType: [
        { key: 1, value: "高压进线" },
        { key: 2, value: "高压出线" },
        { key: 3, value: "低压进线" },
        { key: 4, value: "低压出线" }
    ],
    intervalKV: null,
    connectType: [
        { key: 1, value: "数据主机" },
        { key: 2, value: "电力表计" },
        { key: 3, value: "温感" },
        { key: 4, value: "烟感" },
        { key: 5, value: "摄像头" }
    ],
    connectKV: null,
    //记事类型
    recordType: [
        { key: 1, value: "事故处理操作" },
        { key: 2, value: "设备告警" }
    ],
    recordKV: null,
    rwType: [{ key: true, value: "是" }, { key: false, value: "否" }],
    rwKV: null,
    communicateHostType: null,
    communicateHostKV: null,
    //抢修工单 状态类型
    repairOrderType: [
        { value: "受理", key: 1 },
        { value: "抢修", key: 2 },
        { value: "归档", key: 3 },
        { value: "完成", key: 4 }
    ],
    repairOrderKV: null,
    //抢修工单 业务来源 类型
    orderResourceType: [
        { value: "用户报修", key: 1 },
        { value: "故障告警", key: 2 }
    ],
    orderResourceKV: null,
    //抢修工单 紧急程度 类型
    urgencyType: [
        { value: "一般", key: 1 },
        { value: "紧急", key: 2 },
        { value: "重要", key: 3 }
    ],
    urgencyKV: null
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
    communicateHostType: state => {
        state.communicateHostType ||
            getCommunicateList({}).then(r => {
                state.communicateHostType = r.data.map(v => {
                    const key = v.Id;
                    const value = v.Name;
                    return { key, value };
                });
                state.communicateHostKV = reduceKV(state.communicateHostType);
            });
        return state.communicateHostType;
    },
    communicateHostKV: state => {
        state.communicateHostKV ||
            getCommunicateList({}).then(r => {
                state.communicateHostType = r.data.map(v => {
                    const key = v.Id;
                    const value = v.Name;
                    return { key, value };
                });
                state.communicateHostKV = reduceKV(state.communicateHostType);
            });
        return state.communicateHostKV;
    },
    panelCabinetType: state => state.panelCabinetType,
    panelCabinetKV: state => {
        state.panelCabinetKV ||
            (state.panelCabinetKV = reduceKV(state.panelCabinetType));
        return state.panelCabinetKV;
    },
    intervalType: state => state.intervalType,
    intervalKV: state => {
        state.intervalKV || (state.intervalKV = reduceKV(state.intervalType));
        return state.intervalKV;
    },
    connectType: state => state.connectType,
    connectKV: state => {
        state.connectKV || (state.connectKV = reduceKV(state.connectType));
        return state.connectKV;
    },
    rwType: state => state.rwType,
    rwKV: state => {
        state.rwKV || (state.rwKV = reduceKV(state.rwType));
        return state.rwKV;
    },
    recordType: state => state.recordType,
    recordKV: state => {
        state.recordKV || (state.recordKV = reduceKV(state.recordType));
        return state.recordKV;
    },
    repairOrderType: state => state.repairOrderType,
    repairOrderKV: state => {
        state.repairOrderKV ||
            (state.repairOrderKV = reduceKV(state.repairOrderType));
        return state.repairOrderKV;
    },
    urgencyType: state => state.urgencyType,
    urgencyKV: state => {
        state.urgencyKV || (state.urgencyKV = reduceKV(state.urgencyType));
        return state.urgencyKV;
    },
    orderResourceType: state => state.orderResourceType,
    orderResourceKV: state => {
        state.orderResourceKV ||
            (state.orderResourceKV = reduceKV(state.orderResourceType));
        return state.orderResourceKV;
    }
};

export default { namespaced: true, state, getters, actions, mutations };