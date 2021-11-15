// 标签管理
import {request} from "@/assets/js/request";

const prefix = '/pixiv/tag/'

export default {
    namespaced: true,
    state: {},
    mutations: {},
    actions: {
        //分页查询
        page: ({dispatch, commit, state}, {page,size,filter}) => {
            return request({
                url:prefix+"page",
                data:{page,size,filter},
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {},
}