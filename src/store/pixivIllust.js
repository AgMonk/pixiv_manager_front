// pixiv作品详情
import {pixivNetRequest} from "@/assets/js/request";
import {getFromCache} from "@/assets/js/CacheUtils";

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
                if (body.hasOwnProperty("urls")
                    // && body.hasOwnProperty("illustType") && body.illustType !== 2
                ) {
                    if (body.hasOwnProperty("illustType") && body.illustType === 2) {
                        // 压缩包
                        body.urls.zip = body.urls.original
                                .substring(0, body.urls.original.lastIndexOf('_'))
                                .replace("img-original", "img-zip-ugoira")
                            + "_ugoira1920x1080.zip";
                    }
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
                if (body.hasOwnProperty('tags') && body.tags.hasOwnProperty('tags')) {
                    body.tags.tags.forEach(item => {
                        if (item.hasOwnProperty('translation')) {
                            const key = item.tag;
                            const value = item.translation.en;
                            commit("pixivTagTranslation/setTranslation", {key, value}, {root: true});
                        }
                    })

                }

                return body
            })
        },
        //检查缓存中是否有作品详情，有则直接使用
        findDetail: ({dispatch, commit, state}, {pid, force}) => {
            return getFromCache({
                cacheObj: state.cache,
                key: pid + "",
                requestMethod: () => dispatch("getDetail", pid),
                expires: 30 * 60,
                force,
            })
        },

        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}