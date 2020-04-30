import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import getters from "./getters";
import status from "./modules/status";
import area from "./modules/area";
import imgOSS from "./modules/imgOSS";
import common from "./modules/common";
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        user,
        tagsView,
        permission,
        settings,
        status,
        area,
        imgOSS,
        common
    },
    getters
});

export default store;