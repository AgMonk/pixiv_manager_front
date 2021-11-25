// 关注用户的作品
import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";
import {copyObj} from "@/assets/js/utils";

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        getFollowLatest: ({dispatch, commit, state}, p) => {
            return pixivNetRequest({
                url: '/ajax/follow_latest/illust',
                params:{
                    mode:"all",
                    lang:'zh',
                    p
                }
            }).then(body => {
                if (!body.hasOwnProperty('thumbnails')) {
                    return []
                }
                const list = body.thumbnails.illust;
                list.forEach(item=>{
                    item.url = item.url.replace("https://i.pximg.net","")
                    item.profileImageUrl = item.profileImageUrl.replace("https://i.pximg.net","")
                })
                return copyObj(list);
            })
        },
        findFollowLatest: ({dispatch, commit, state}, p) => {
            return checkCache(state.cache,p+"",5*60,()=>dispatch("getFollowLatest",p))
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}