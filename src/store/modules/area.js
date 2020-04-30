import area from '@/utils/area_data1';

const state = {
    all: null,
    allKV: null,
    province: null,
    provinceKV: null,
    city: null,
    cityKV: null,
    region: null,
    regionKV: null
}

function reduceFn(arr) {
    return arr.reduce((l, v) => {
        l[v.c] = v.a
        return l
    }, {})
}

function initData(state) {
    state.all = JSON.parse(area)
    state.province = state.all.filter(v => v.l == 1);
    state.city = state.all.filter(v => v.l == 2);
    state.region = state.all.filter(v => v.l == 3);
    state.allKV = reduceFn(state.all)
}
const getters = {
    all: state => {
        state.all || initData(state)
        return state.all
    },
    allKV: state => {
        state.allKV || initData(state)
        return state.allKV
    },
    province: state => {
        state.province || initData(state)
        return state.province
    },
    city: state => {
        state.city || initData(state)
        return state.city
    },
    region: state => {
        state.region || initData(state)
        return state.region
    }
}

export default { namespaced: true, state, getters };