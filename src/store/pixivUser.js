// 

import {pixivNetRequest} from "@/assets/js/request";

const prefix = '/ajax/user/'

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        getUserInfo: ({dispatch, commit, state}, uid) => {
            return pixivNetRequest({
                url: prefix + uid,
                params:{
                    full:0,
                    lang:'zh',
                },
            }).then(body=>{


                console.log(body)
                //加入缓存
                const time = Math.floor(new Date().getTime() / 1000 / 60)
                state.cache[body.userId] = {body, time};
                return body
            })
        },
        findUserInfo: ({dispatch, commit, state}, uid) => {
            const time = Math.floor(new Date().getTime() / 1000 / 60)
            if (state.cache.hasOwnProperty(uid + "") && time - state.cache[uid + ""].time < 60) {
                return new Promise((r) => r(state.cache[uid + ""].body))
            }
            return dispatch(`getUserInfo`, uid);
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}