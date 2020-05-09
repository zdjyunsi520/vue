import Vue from "vue";

import Cookies from "js-cookie";

import "normalize.css/normalize.css"; // a modern alternative to CSS resets

import Element from "element-ui";

import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/styles/king.scss' // common css

import App from "./App";
import store from "./store";
import router from "./router";
import permission from "./directive/permission";

import "./assets/icons"; // icon
import "./permission"; // permission control
//字典配置
import { getDicts } from "@/api/system/dict/data";
//参数配置
import { getConfigKey } from "@/api/system/config";
//工具类
import {
    parseTime,
    resetForm,
    addDateRange,
    selectDictLabel,
    download
} from "@/utils/king";
import Pagination from "@/components/Pagination";

// 全局方法挂载
Vue.prototype.getDicts = getDicts;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.parseTime = parseTime;
Vue.prototype.resetForm = resetForm;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.download = download;

Vue.prototype.msgSuccess = function(msg) {
    this.$message({ showClose: true, message: msg, type: "success" });
};

Vue.prototype.msgError = function(msg) {
    this.$message({ showClose: true, message: msg, type: "error" });
};

Vue.prototype.msgInfo = function(msg) {
    this.$message.info(msg);
};

// 全局组件挂载
Vue.component("Pagination", Pagination);

Vue.use(permission);

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
    size: Cookies.get("size") || "medium" // set element-ui default size
});

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    router,
    store,
    render: h => h(App)
});