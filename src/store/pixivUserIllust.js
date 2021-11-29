// pixiv用户的作品
import {pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";
import {replacePixivNetOne} from "@/assets/js/pixivUtils";

function getKey({uid, work_category, size, page}) {
    return `作者作品 ${uid} type:${work_category} size:${size} page:${page}`;
}

export default {
    namespaced: true,
    state: {
        all: {},
        illusts: {},
    },
    mutations: {
        delCache: (state, {uid, work_category, size, page}) => {
            const key = getKey({uid, work_category, size, page});
            console.log(`移除缓存 ${key}`)
            delete state.illusts[key]
        },
    },
    actions: {
        //获取作者所有作品id
        getProfileAll: ({dispatch, commit, state}, uid) => {
            return pixivNetRequest({url: `/ajax/user/${uid}/profile/all?lang=zh`}).then(res => {
                const {illusts, manga, pickup} = res
                return {illust: illusts, manga, pickup};
            })
        },
        //获取作者所有作品id
        findProfileAll: ({dispatch, commit, state}, uid) => {
            return checkCache(state.all, `${uid}` , 60 * 60, () => dispatch("getProfileAll", uid))
        },
        /**
         * 获取指定id的作者作品信息
         * @param dispatch dispatch
         * @param commit commit
         * @param state state
         * @param uid uid
         * @param ids 请求的作品pid数组
         * @param work_category 作品类型：illust 、 manga
         * @param is_first_page 是否为第一页 1 = 是 0 = 不是
         * @param lang zh
         * @returns {Promise<AxiosResponse<any>>}
         */
        getProfileIllusts: ({dispatch, commit, state}, {uid, page, size, work_category, lang = 'zh'}) => {
            //pid数组 降序
            const pidArray = Object.keys(state.all[uid].body[work_category]).reverse();
            const start = (page - 1) * size;
            const end =  Math.min(pidArray.length,start+size);
            //需要查询的pid
            const ids = pidArray.slice(start,end);
            const is_first_page = page===1?1:0;

            return pixivNetRequest({
                    url: `/ajax/user/${uid}/profile/illusts`,
                    headers: {
                        'x-user-id': uid,
                    },
                    params:{uid, ids, work_category, is_first_page, lang},
                },
            ).then(res => {
                const a = [];

                Object.keys(res.works).reverse().forEach(key=>{
                    const value = res.works[key];
                    replacePixivNetOne(value)
                    a.push(value)
                })
                return a;
            })
        },
        findProfileIllusts: ({dispatch, commit, state}, {uid, page, size, work_category, lang = 'zh'}) => {
            const userId = uid + ``;
            if (!state.all.hasOwnProperty(userId)) {
                throw "还未获取id列表"
            }
            //缓存key
            const key = getKey({uid, work_category, size, page});
            return checkCache(state.illusts, key, 60 * 60, () => dispatch("getProfileIllusts"
                , {uid, page, size, work_category, lang }))
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}