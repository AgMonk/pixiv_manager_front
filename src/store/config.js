// 配置
// noinspection JSUnusedLocalSymbols

import {copyObj} from "@/assets/js/utils";
import {getCache, putCache} from "@/assets/js/storageUtils";
import {ElMessage} from "element-plus";

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
            //当前用户的uid
            uid: "",
            //保存搜索关键字
            keywords: [],
            keyword: "",
            blackList: {
                user: {},
            }
        },
    },
    mutations: {
        addBlackListUser: (state, {id, name}) => {
            state.config.blackList = state.config.blackList ? state.config.blackList : {user: {}};
            state.config.blackList.user = state.config.blackList.user ? state.config.blackList.user : {};
            state.config.blackList.user[id] = name;
            state.config = copyObj(state.config);
            putCache("config", state.config);
        },
        delBlackListUser: (state, id) => {
            if (state.config.blackList && state.config.blackList.user && state.config.blackList.user.hasOwnProperty(id)) {
                delete state.config.blackList.user[id]
                state.config = copyObj(state.config);
                putCache("config", state.config);
                ElMessage.success('已解除屏蔽')
            }
        },
        setConfig: (state, {key, value}) => {
            state.config[key] = value;
            console.log('更新配置: ' + key)
            console.log(value)
            putCache("config", state.config);
        },
        updateConfig: (state, payload) => {
            const token = state.config.token
            state.config = copyObj(payload);
            state.config.token = token;
            putCache("config", state.config);
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
    getters: {
        stringifyConfig: (state) => {
            const json = copyObj(state.config)
            delete json.token
            return JSON.stringify(json)
        },
    },
}