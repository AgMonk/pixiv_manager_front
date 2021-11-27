// pixiv作品详情
import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";

const prefix = '/ajax/illust/'


export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        //请求作品详情
        getDetail: ({dispatch, commit, state}, pid) => {
            return pixivNetRequest({url: prefix + pid}).then(body => {

                // 解析所有 url
                if (body.hasOwnProperty("urls") && body.hasOwnProperty("illustType") && body.illustType !== 2) {
                    Object.keys(body.urls).forEach(key => {
                        let url = body.urls[key].replace("https://i.pximg.net", "")
                        let urls = [];
                        for (let i = 0; i < body.pageCount; i++) {
                            urls.push(url.replace("_p0", "_p" + i))
                        }
                        body.urls[key] = urls
                    })
                }
                console.log(body)

                //标签翻译
                if (body.hasOwnProperty('tags') && body.tags.hasOwnProperty('tags')){
                    body.tags.tags.forEach(item=>{
                        const key = item.tag;
                        const value = item.translation.en;
                        commit("pixivTagTranslation/setTranslation", {key, value}, {root: true});
                    })

                }

                return body
            })
        },
        //检查缓存中是否有作品详情，有则直接使用
        findDetail: ({dispatch, commit, state}, pid) => {
            return checkCache(state.cache,pid+"",60*60,()=>dispatch("getDetail",pid))
        },

        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}