// 收藏和关注

import {pixivNetPostFormDataRequest, pixivNetPostRequest} from "@/assets/js/request";

const prefix = '/'

export default {
    namespaced: true,
    state: {},
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
                url:'/ajax/illusts/bookmarks/add',
                data:{
                    illust_id:pid,
                    restrict:0,
                    comment:'',
                    tags:[]
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
                    mode:'delete_illust_bookmark',
                    bookmark_id:bookmarkId
                },
                headers: {
                    'x-csrf-token': token,
                }
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}