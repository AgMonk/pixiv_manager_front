// 搜索作品
import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";
import {replacePixivNetArray} from "@/assets/js/pixivUtils";

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        getSearch: ({dispatch, commit, state}, {keyword, p = 1, mode = 'all'}) => {
            return pixivNetRequest({
                url: '/ajax/search/artworks/' + encodeURI(keyword),
                params: {p, mode},
            }).then(body=>{
                const title = body.extraData.meta.title;
                const {data,total} = body.illustManga;
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

                const res = {title,data,total,popular,relatedTags}
                console.log(res)
                return res;

            })
        },
        findSearch: ({dispatch, commit, state}, {keyword, p = 1, mode = 'all'}) => {
            return checkCache(state.cache, `搜索作品 keyword:${keyword} mode:${mode} page:${p}`
                , 10 * 60, () => dispatch("getSearch", {keyword, p, mode}))
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}