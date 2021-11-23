// 配置
import {copyObj} from "@/assets/js/utils";
import {getCache, putCache} from "@/assets/js/storageUtils";

export default {
    namespaced: true,
    state: {
        config: {
            // 图片域名
            imgDomain: "/pximg",
        },
    },
    mutations: {
        updateConfig: (state, payload) => {
            state.config = copyObj(payload);
            putCache("config", payload);
        },
        loadConfig: (state) => {
            const cache = getCache("config");
            state.config = cache?cache:state.config;
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}