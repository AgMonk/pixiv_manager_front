// pixiv文件
// noinspection JSUnusedLocalSymbols

import {request} from "@/assets/js/request";

export default {
    namespaced: true,
    state: {},
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        listDirs: ({dispatch, commit, state}, payload) => {
            return request({
                url: '/files/pixiv/listDirs',
            }).then(res => res.data)
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}