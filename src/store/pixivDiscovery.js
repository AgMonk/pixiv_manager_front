// 发现作品
import {pixivNetRequest} from "@/assets/js/request";
import {setTagTranslation} from "@/assets/js/projectUtils";
import {replacePixivNetArray} from "@/assets/js/pixivUtils";

export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        discovery: ({dispatch, commit, state}, {mode = 'all', limit, lang = 'zh', sampleIllustId}) => {
            return pixivNetRequest({
                url: `/ajax/discovery/artworks`,
                params: {mode, limit, lang, sampleIllustId},
            }).then(body => {

                setTagTranslation(body, commit)

                const recommend = body.recommendedIllusts.sort((a, b) => a.illustId - b.illustId)
                const illust = body.thumbnails.illust.sort((a, b) => a.id - b.id)
                // console.log(recommend)
                // console.log(illust)

                const list = [];

                for (let i = 0; i < recommend.length; i++) {
                    const a = recommend[i];
                    const b = illust[i];
                    if (a.illustId === b.id) {
                        delete a.illustId;
                        list.push({...a, ...b})
                    }
                }

                replacePixivNetArray(list)

                const data = list.sort((a, b) => b.recommendScore - a.recommendScore);

                console.log(data)

                return data
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}