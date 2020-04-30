import { fetchTotalCount } from '@/api/common'
const state = {
    merId: null,
    buyerId: null,
    orderNo: null,
    taskNo: null,
    buyerId: null,
    form: {
        transactionType: 1,
        taskNo: "",
        orderNo: "",
        buyerId: "",
        buyerAccount: "",
        transactionMoney: "",
        note: "",
        resource: 0
    },
    count: {
        bWithdrawRecord: 0,
        sysFeedback: 0,
        mMerchantBindStore: 0,
        bBuyerAudit: 0,
        mWithdrawRecord: 0,
        merchantAppeal: 0,
        bBuyerAccountInfo: 0,
        buyerAppeal: 0,
        mRechargeRecord: 0,
        bBindJdAccountInfo: 0,
        bBindTbAccountInfo: 0,
        bBindPddAccountInfo: 0
    }
};

const actions = {
    refresh: ({ state }) => {
        fetchTotalCount().then(r => {
            Object.assign(state.count, r.data)
        })
    }
}
export default { namespaced: true, state, actions };