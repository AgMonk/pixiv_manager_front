// 配置
import {copyObj} from "@/assets/js/utils";
import {getCache, putCache} from "@/assets/js/storageUtils";

export default {
    namespaced: true,
    state: {
        config: {
            // 图片域名
            imgDomain: "/pximg",
            //aria2下载配置
            aria2: {
                dir: 'd:/download/aria2',
            },
            //是否过滤掉已收藏作品
            filterBookmarked: false,
            uid:"",
        },
    },
    mutations: {
        setConfig: (state, {key, value}) => {
            state.config[key] = value;
            putCache("config", state.config);
        },
        updateConfig: (state, payload) => {
            state.config = copyObj(payload);
            putCache("config", payload);
        },
        loadConfig: (state) => {
            const cache = getCache("config");
            state.config = cache ? cache : state.config;
            console.log("加载配置")
            console.log(state.config)
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}