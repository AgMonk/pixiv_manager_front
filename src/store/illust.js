// pixiv作品详情
import {pixivNetRequest} from "@/assets/js/request";

const prefix = '/ajax/illust/'


export default {
    namespaced: true,
    state: {
        cache:{},
    },
    mutations: {},
    actions: {
        getDetail: ({dispatch, commit, state}, pid) => {
            return pixivNetRequest({url:prefix+pid})
        },
    method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}