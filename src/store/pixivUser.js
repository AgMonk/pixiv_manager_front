//

import {pixivNetRequest} from "@/assets/js/request";
import {getFromCache} from "@/assets/js/CacheUtils";

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
                    lang: 'zh',
                },

            }).then(res => {
                res.image = res.image.replace("https://i.pximg.net", "")
                res.imageBig = res.imageBig.replace("https://i.pximg.net", "")
                console.log(res)
                return res
            })
        },
        findUserInfo: ({dispatch, commit, state}, {uid, force}) => {
            return getFromCache({
                cacheObj: state.cache,
                key: uid + "",
                expires: 60 * 60,
                requestMethod: () => dispatch("getUserInfo", uid),
                force,
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}