// 收藏和关注

import {pixivNetPostFormDataRequest, pixivNetPostRequest, pixivNetRequest} from "@/assets/js/request";
import {checkCache} from "@/assets/js/CacheUtils";
import {replacePixivNetArray} from "@/assets/js/pixivUtils";

const prefix = '/'

export default {
    namespaced: true,
    state: {
        cache: {},
    },
    mutations: {},
    actions: {
        follow: ({dispatch, commit, state}, {uid, token}) => {
            const formData = {
                mode: "add",
                type: "user",
                user_id: uid,
                tag: "",
                restrict: 0,
                format: "json",
            }
            return pixivNetPostFormDataRequest({
                url: '/bookmark_add.php',
                data: formData,
                headers: {
                    'x-csrf-token': token,
                }
            })
        },
        unfollow: ({dispatch, commit, state}, {uid, token}) => {
            const formData = {
                mode: "del",
                type: "bookuser",
                id: uid,
            }
            return pixivNetPostFormDataRequest({
                url: '/rpc_group_setting.php',
                data: formData,
                headers: {
                    'x-csrf-token': token,
                }
            })
        },
        bookmarkAdd: ({dispatch, commit, state}, {pid, token}) => {
            return pixivNetPostRequest({
                url: '/ajax/illusts/bookmarks/add',
                data: {
                    illust_id: pid,
                    restrict: 0,
                    comment: '',
                    tags: []
                },
                headers: {
                    'x-csrf-token': token,
                }
            })
        },
        bookmarkDel: ({dispatch, commit, state}, {bookmarkId, token}) => {
            return pixivNetPostFormDataRequest({
                url: '/rpc/index.php',
                data: {
                    mode: 'delete_illust_bookmark',
                    bookmark_id: bookmarkId
                },
                headers: {
                    'x-csrf-token': token,
                }
            })
        },
        getBookmark: ({dispatch, commit, state}, {uid, tag, rest = 'show', page = 1, size = 48}) => {
            const offset = (page - 1) * size;
            const limit = size;

            return pixivNetRequest({
                url: `/ajax/user/${uid}/illusts/bookmarks`,
                params: {rest, offset, limit, tag, lang: 'zh'},
            }).then(res => {
                console.log(res)
                replacePixivNetArray(res.works)
                return res
            })
        },
        findBookmark: ({dispatch, commit, state}, {uid, tag, rest = 'show', page = 1, size = 48}) => {
            return checkCache(state.cache, `收藏的作品 ${uid} size:${size} page:${page} tag:${tag}`
                , 60, () => dispatch("getBookmark", {uid, tag, rest, page, size}))
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}