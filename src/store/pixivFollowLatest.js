// 关注用户的作品
import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";
import {copyObj} from "@/assets/js/utils";
import {replacePixivNetArray} from "@/assets/js/pixivUtils";

const getKey = (page) =>{
    return `关注的作品 第 ${page} 页`
}

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {
        delCache: (state, page) => {
            const key = getKey(page);
            console.log(`移除缓存 ${key}`)
            delete state.cache[key]
        },
    },
    actions: {
        getFollowLatest: ({dispatch, commit, state}, p) => {
            return pixivNetRequest({
                url: '/ajax/follow_latest/illust',
                params: {
                    mode: "all",
                    lang: 'zh',
                    p
                }
            }).then(body => {
                if (!body.hasOwnProperty('thumbnails')) {
                    return []
                }

                const translation = {};
                //标签翻译
                const tagTranslation = body.tagTranslation
                Object.keys(tagTranslation).forEach(key => {
                    const v = tagTranslation[key]
                    const zh = v.zh;
                    const zhTw = v.zh_tw;
                    const en = v.en;
                    const value = zh ? zh : (zhTw ? zhTw : (en ? en : key));
                    translation[key] = value;
                    commit("pixivTagTranslation/setTranslation", {key, value}, {root: true});
                })


                //作品列表
                const list = body.thumbnails.illust;
                replacePixivNetArray(list)

                list.forEach(item => {
                    item.tagTranslation = item.tags.map(t=> {
                        return {key: t, value:translation[t]}
                    })
                })


                return copyObj(list);
            })
        },
        findFollowLatest: ({dispatch, commit, state}, p) => {
            return checkCache(state.cache, getKey(p), 60, () => dispatch("getFollowLatest", p))
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}