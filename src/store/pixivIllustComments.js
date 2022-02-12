// 作品评论
// noinspection JSUnusedLocalSymbols

import {pixivNetRequest} from "@/assets/js/request";

const prefix = '/ajax/illusts/comments/'


export default {
    namespaced: true,
    state: {},
    mutations: {
        method(state, payload) {

        },
    },
    actions: {
        roots: ({dispatch, commit, state}, {pid, offset, limit = 50, lang = 'zh'}) => {
            return pixivNetRequest({
                url: prefix + "roots", params: {illust_id: pid, offset, limit, lang}
            })
        },
        replies: ({dispatch, commit, state}, {id, page = 1, lang = 'zh'}) => {
            return pixivNetRequest({
                url: prefix + "replies", params: {comment_id: id, page, lang}
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}