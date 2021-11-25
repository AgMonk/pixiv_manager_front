// 

import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";

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

            }).then(res=>{
                res.image = res.image.replace("https://i.pximg.net","")
                res.imageBig = res.imageBig.replace("https://i.pximg.net","")
                console.log(res)
                return res
            })
        },
        findUserInfo: ({dispatch, commit, state}, uid) => {
           return checkCache(state.cache,uid+"",60*60,()=>dispatch("getUserInfo",uid))
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}