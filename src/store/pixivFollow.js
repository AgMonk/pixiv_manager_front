// pixiv关注用户的作品

import {pixivNetRequest} from "@/assets/js/request";

const prefix = '/ajax/follow_latest/illust'


export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        getFollow: ({dispatch, commit, state}, p) => {
            return pixivNetRequest({
                url:prefix,
                params:{
                    p,mode:"all",lang:"zh"
                }
            })

        },
      method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}