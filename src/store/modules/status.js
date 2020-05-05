import { fetchDept, fetchOrder, fetchRefuse, fetchBank } from "@/api/common";

const state = {
  deptType: null,
  deptKV: null,
  orderType: null,
  orderKV: null,
  jd_wang_wang_refuse_remarksType: null,
  jd_wang_wang_refuse_remarksKV: null,
  pdd_wang_wang_refuse_remarksType: null,
  pdd_wang_wang_refuse_remarksKV: null,
  tb_wang_wang_refuse_remarksType: null,
  tb_wang_wang_refuse_remarksKV: null,
  Identity_audit_refuse_remarksType: null,
  sys_bank_nameType: null,
  sys_bank_nameKV: null,
  equipmentType: [
    { key: 0, value: "通讯主机" },
    { key: 1, value: "电力表计" },
    { key: 2, value: "温控" },
    { key: 3, value: "烟感" },
    { key: 4, value: "摄像头" }
  ],
  equipmentKV: null,
  rechargeType: [
    { key: 0, value: "待审核" },
    { key: 1, value: "初审通过" },
    { key: 2, value: "复审通过" },
    { key: 3, value: "初审拒绝" },
    { key: 4, value: "复审拒绝" }
  ],

  rechargeKV: null,
  bankRecordUserKV: null,
  bankRecordUserType: [
    { key: 1, value: "买手" },
    { key: 2, value: "推广员" },
    { key: 3, value: "分站" },
    { key: 4, value: "商家" }
  ],
  mallOrderType: [
    { key: "1", value: "未放出" },
    { key: "2", value: "未接单" },
    { key: "3", value: "进行中" },
    { key: "4", value: "待返款发货" },
    { key: "5", value: "待评价" },
    { key: "6", value: "待确认" },
    { key: "7", value: "已完成" },
    { key: "8", value: "已撤销" }
  ],
  mallOrderKV: null,
  simpleRechargeType: [
    { key: 1, value: "未审核" },
    { key: 2, value: "未兑现" },
    { key: 3, value: "已兑现" },
    { key: 4, value: "已撤回" }
  ],
  simpleRechargeKV: null,
  moneyType: [{ key: 1, value: "本金" }, { key: 2, value: "佣金" }],
  moneyKV: null,
  disableType: [{ key: 0, value: "正常" }, { key: 1, value: "禁用" }],
  disableKV: null,
  accountType: [
    { key: 0, value: "待审核" },
    { key: 1, value: "审核通过" },
    { key: 2, value: "审核拒绝" },
    { key: 3, value: "已拉黑" }
  ],
  accountKV: null,
  platformType: [
    { key: 1, value: "淘宝" },
    { key: 3, value: "京东" },
    { key: 4, value: "拼多多" }
  ],
  platformKV: null,
  sellerType: [
    { key: 0, value: "待审核" },
    { key: 1, value: "正常" },
    { key: 2, value: "禁用" }
  ],
  sellerKV: null,
  taskType: [
    { key: 1, value: "已提交待付款" },
    { key: 2, value: "已付款待审核" },
    { key: 3, value: "审核通过任务进行中" },
    { key: 4, value: "任务全部完成" },
    { key: 5, value: "已删除" }
  ],
  taskKV: null,
  complainType: [
    { key: 1, value: "申述中" },
    { key: 2, value: "申诉成功" },
    { key: 3, value: "申述失败" },
    { key: 4, value: "申述撤销" }
  ],
  complainKV: null,
  complainBuyerType: [
    { key: 1, value: "待商家处理" },
    { key: 2, value: "商家驳回申述" },
    { key: 3, value: "商家通过申述" },
    { key: 4, value: "客服介入中" },
    { key: 5, value: "客服驳回申述" },
    { key: 6, value: "客服通过申述" },
    { key: 7, value: "买手主动撤回" }
  ],
  complainBuyerKV: null,
  complainContentType: [
    { key: "1", value: "本佣已返给买手，买手申请退款" },
    { key: "2", value: "本金已返给买手，买手申请退款" },
    { key: "3", value: "买手未好评上传错误截图要求商家返佣" },
    { key: "4", value: "买手拍错店铺，或者上传错任务截图" },
    { key: "5", value: "买手实际花费低于提交的本金" },
    { key: "6", value: "买手拍错链接" },
    { key: "7", value: "其他问题" }
  ],
  complainContentKV: null,
  complainContentBuyerType: [
    { key: "1", value: "达不到商家备注要求" },
    { key: "2", value: "商品找不到" },
    { key: "3", value: "不想做了" },
    { key: "4", value: "商家发布金额跟实际不一致" },
    { key: "5", value: "链接验证超时系统自动撤单" },
    { key: "6", value: "系统超时自动撤单" }
  ],
  complainContentBuyerKV: null,
  genderType: [
    { key: "0", value: "男" },
    { key: "1", value: "女" },
    { key: "2", value: "未知" }
  ],
  genderKV: null,
  buyerRecordSourceType: [
    { key: 1, value: "订单" },
    { key: 2, value: "后台充值" },
    { key: 3, value: "提现" }
  ],
  buyerRecordSourceKV: null,
  addEvaluationType: [
    { key: 1, value: "追评中" },
    { key: 2, value: "追评确认" },
    { key: 3, value: "追评完成" },
    { key: 4, value: "追评撤销" }
  ],
  addEvaluationKV: null
};
var loading = 1;

function initRefuseType(types, state) {
  if (loading) {
    loading = 0;
    fetchRefuse({ types })
      .then(r => {
        state[types + "Type"] = r.data[types].map(v => {
          const key = v.dictLabel;
          const value = v.dictLabel;
          return { key, value };
        });
      })
      .finally(() => (loading = 1));
  }
}

function initBankType(types, state) {
  if (loading) {
    loading = 0;
    fetchBank()
      .then(r => {
        state[types + "Type"] = r.data.map(v => {
          const key = v.remark;
          const value = v.dictLabel;
          return { key, value };
        });
        state[types + "KV"] = reduceKV(state[types + "Type"]);
      })
      .finally(() => (loading = 1));
  }
}
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
  deptType: state => {
    state.deptType ||
      fetchDept().then(({ data }) => {
        state.deptType = data;
        state.deptKV = data.reduce((l, v) => {
          l[v.deptId] = v.deptName;
          return l;
        }, {});
      });
    return state.deptType;
  },
  deptKV: state => {
    state.deptKV ||
      fetchDept().then(({ data }) => {
        state.deptType = data;
        state.deptKV = data.reduce((l, v) => {
          l[v.deptId] = v.deptName;
          return l;
        }, {});
      });
    return state.deptKV;
  },
  orderType: state => {
    state.orderType ||
      fetchOrder().then(({ data }) => {
        state.orderType = data;
        state.orderKV = data.reduce((l, v) => {
          l[v.id] = v.taskName;
          return l;
        }, {});
      });
    return state.orderType;
  },
  orderKV: state => {
    state.orderKV ||
      fetchOrder().then(({ data }) => {
        state.orderType = data;
        state.orderKV = data.reduce((l, v) => {
          l[v.id] = v.taskName;
          return l;
        }, {});
      });
    return state.orderKV;
  },
  rechargeType: state => state.rechargeType,
  rechargeKV: state => {
    state.rechargeKV || (state.rechargeKV = reduceKV(state.rechargeType));
    return state.rechargeKV;
  },
  moneyType: state => state.moneyType,
  moneyKV: state => {
    state.moneyKV || (state.moneyKV = reduceKV(state.moneyType));
    return state.moneyKV;
  },
  disableType: state => state.disableType,
  disableKV: state => {
    state.disableKV || (state.disableKV = reduceKV(state.disableType));
    return state.disableKV;
  },
  accountType: state => state.accountType,
  accountKV: state => {
    state.accountKV || (state.accountKV = reduceKV(state.accountType));
    return state.accountKV;
  },
  platformType: state => state.platformType,
  platformKV: state => {
    state.platformKV || (state.platformKV = reduceKV(state.platformType));
    return state.platformKV;
  },
  sellerType: state => state.sellerType,
  sellerKV: state => {
    state.sellerKV || (state.sellerKV = reduceKV(state.sellerType));
    return state.sellerKV;
  },
  taskType: state => state.taskType,
  taskKV: state => {
    state.taskKV || (state.taskKV = reduceKV(state.taskType));
    return state.taskKV;
  },
  simpleRechargeType: state => state.simpleRechargeType,
  simpleRechargeKV: state => {
    state.simpleRechargeKV ||
      (state.simpleRechargeKV = reduceKV(state.simpleRechargeType));
    return state.simpleRechargeKV;
  },
  complainType: state => state.complainType,
  complainKV: state => {
    state.complainKV || (state.complainKV = reduceKV(state.complainType));
    return state.complainKV;
  },
  complainBuyerType: state => state.complainBuyerType,
  complainBuyerKV: state => {
    state.complainBuyerKV ||
      (state.complainBuyerKV = reduceKV(state.complainBuyerType));
    return state.complainBuyerKV;
  },
  complainContentType: state => state.complainContentType,
  complainContentKV: state => {
    state.complainContentKV ||
      (state.complainContentKV = reduceKV(state.complainContentType));
    return state.complainContentKV;
  },
  mallOrderType: state => state.mallOrderType,
  mallOrderKV: state => {
    state.mallOrderKV || (state.mallOrderKV = reduceKV(state.mallOrderType));
    return state.mallOrderKV;
  },
  genderType: state => state.genderType,
  genderKV: state => {
    state.genderKV || (state.genderKV = reduceKV(state.genderType));
    return state.genderKV;
  },
  complainContentBuyerType: state => state.complainContentBuyerType,
  complainContentBuyerKV: state => {
    state.complainContentBuyerKV ||
      (state.complainContentBuyerKV = reduceKV(state.complainContentBuyerType));
    return state.complainContentBuyerKV;
  },
  jd_wang_wang_refuse_remarksType: state => {
    state.jd_wang_wang_refuse_remarksType ||
      initRefuseType("jd_wang_wang_refuse_remarks", state);
    return state.jd_wang_wang_refuse_remarksType;
  },
  pdd_wang_wang_refuse_remarksType: state => {
    state.pdd_wang_wang_refuse_remarksType ||
      initRefuseType("pdd_wang_wang_refuse_remarks", state);
    return state.pdd_wang_wang_refuse_remarksType;
  },
  tb_wang_wang_refuse_remarksType: state => {
    state.tb_wang_wang_refuse_remarksType ||
      initRefuseType("tb_wang_wang_refuse_remarks", state);
    return state.tb_wang_wang_refuse_remarksType;
  },
  Identity_audit_refuse_remarksType: state => {
    state.Identity_audit_refuse_remarksType ||
      initRefuseType("Identity_audit_refuse_remarks", state);
    return state.Identity_audit_refuse_remarksType;
  },
  sys_bank_nameType: state => {
    state.sys_bank_nameType || initBankType("sys_bank_name", state);
    return state.sys_bank_nameType;
  },
  sys_bank_nameKV: state => {
    state.sys_bank_nameKV || initBankType("sys_bank_name", state);
    return state.sys_bank_nameKV;
  },
  bankRecordUserType: state => state.bankRecordUserType,
  bankRecordUserKV: state => {
    state.bankRecordUserKV ||
      (state.bankRecordUserKV = reduceKV(state.bankRecordUserType));
    return state.bankRecordUserKV;
  },
  buyerRecordSourceType: state => state.buyerRecordSourceType,
  buyerRecordSourceKV: state => {
    state.buyerRecordSourceKV ||
      (state.buyerRecordSourceKV = reduceKV(state.buyerRecordSourceType));
    return state.buyerRecordSourceKV;
  },
  addEvaluationType: state => state.addEvaluationType,
  addEvaluationKV: state => {
    state.addEvaluationKV ||
      (state.addEvaluationKV = reduceKV(state.addEvaluationType));
    return state.addEvaluationKV;
  },
  equipmentType: state => state.equipmentType,
  equipmentKV: state => {
    state.equipmentKV || (state.equipmentKV = reduceKV(state.equipmentType));
    return state.equipmentKV;
  }
};

export default { namespaced: true, state, getters, actions, mutations };
