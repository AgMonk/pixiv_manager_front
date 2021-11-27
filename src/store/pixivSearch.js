// 搜索作品
import {pixivNetRequest} from "@/assets/js/request";

export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        getSearch: ({dispatch, commit, state}, {keyword,p=1,mode='all'}) => {
            return pixivNetRequest({
                url:'/ajax/search/artworks/'+encodeURI(keyword),
                params: {p,mode},
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}