// 收藏和关注

import {pixivNetPostFormDataRequest} from "@/assets/js/request";

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
        method: ({dispatch, commit, state}, payload) => {

        },
    },
    getters: {},
}