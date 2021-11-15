// 标签管理
import {request} from "@/assets/js/request";
import {copyObj} from "@/assets/js/utils";

const prefix = '/pixiv/tag/'

export default {
    namespaced: true,
    state: {
        params:{
            filter: {
                type: "未完成"
            },
            page: 1,
            size: 10
        },
    },
    mutations: {
        setParams(state,params){
            state.params = copyObj(params);
        },
    },
    actions: {
        //分页查询
        page: ({dispatch, commit, state}) => {
            return request({
                url:prefix+"page",
                data:state.params,
            })
        },
        findAllCompletedTags: ({dispatch, commit, state}) => {
            return request({
                url:prefix+"findAllCompletedTags",
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {
        getParams(state){
            return copyObj(state.params)
        }
    },
}