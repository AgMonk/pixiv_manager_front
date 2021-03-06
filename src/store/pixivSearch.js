// 搜索作品
import {pixivNetRequest} from "@/assets/js/request";
import {getFromCache} from "@/assets/js/CacheUtils";
import {replacePixivNetArray} from "@/assets/js/pixivUtils";

const getKey = ({keyword, p, mode, scd, ecd}) => {
    return `搜索作品 keyword:${keyword} mode:${mode} page:${p} ${scd}-${ecd}`;
}

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {
        delCache: (state, {keyword, p, mode = 'all', scd, ecd}) => {
            const key = getKey({keyword, p, mode, scd, ecd})
            console.log(`移除缓存 ${key}`)
            delete state.cache[keyword][key]
        },
    },
    actions: {
        getSearch: ({dispatch, commit, state}, {keyword, p = 1, mode = 'all', scd, ecd}) => {
            return pixivNetRequest({
                url: '/ajax/search/artworks/' + encodeURI(keyword),
                params: {p, mode, scd, ecd},
            }).then(body => {
                const title = body.extraData.meta.title;
                const {data, total} = body.illustManga;
                const popular = body.popular;
                const relatedTags = body.relatedTags;

                replacePixivNetArray(data)
                replacePixivNetArray(popular.permanent)
                replacePixivNetArray(popular.recent)

                //标签翻译
                const tagTranslation = body.tagTranslation
                Object.keys(tagTranslation).forEach(key => {
                    const value = tagTranslation[key].zh;
                    commit("pixivTagTranslation/setTranslation", {key, value}, {root: true});
                })

                return {title, data, total, popular, relatedTags};

                // }).catch(reason => {
                //     ElMessage.error(reason)
            })
        },
        findSearch: ({dispatch, commit, state}, {force, keyword, p = 1, mode = 'all', scd, ecd}) => {
            if (!state.cache.hasOwnProperty(keyword)) {
                state.cache[keyword] = {}
            }
            const key = getKey({keyword, p, mode, scd, ecd})
            console.log(key)
            return getFromCache({
                cacheObj: state.cache[keyword],
                key,
                requestMethod: () => dispatch("getSearch", {keyword, p, mode, scd, ecd}),
                expires: 30 * 60,
                force
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}