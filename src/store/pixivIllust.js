// pixiv作品详情
import {pixivNetRequest} from "@/assets/js/request";

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
                //加入缓存
                const time = Math.floor(new Date().getTime() / 1000 / 60)
                state.cache[body.id] = {body, time};
                return body
            })
        },
        //检查缓存中是否有作品详情，有则直接使用
        findDetail: ({dispatch, commit, state}, pid) => {
            const time = Math.floor(new Date().getTime() / 1000 / 60)
            if (state.cache.hasOwnProperty(pid + "") && time - state.cache[pid + ""].time < 60) {
                return new Promise((r) => r(state.cache[pid + ""].body))
            }
            return dispatch(`getDetail`, pid);
        },

        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}