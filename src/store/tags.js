// 标签管理
import {request} from "@/assets/js/request";
import {copyObj} from "@/assets/js/utils";
import {ElMessage} from "element-plus";

const prefix = '/pixiv/tag/'

export default {
    namespaced: true,
    state: {
        params: {
            filter: {
                type: "未完成"
            },
            page: 1,
            size: 10
        },
        tagTypes: [],
    },
    mutations: {
        setParams(state, params) {
            state.params = copyObj(params);
        },
    },
    actions: {
        //分页查询
        page: ({dispatch, commit, state}) => {
            return request({
                url: prefix + "page",
                data: state.params,
            })
        },
        findAllTypes: ({dispatch, commit, state}) => {
            return request({
                url: prefix + "findAllTypes",
            }).then(res => state.tagTypes = res.data)
        },
        findAllCompletedTags: ({dispatch, commit, state}) => {
            return request({
                url: prefix + "findAllCompletedTags",
            })
        },
        setCustomTranslation: ({dispatch, commit, state},{tag,translation,type}) => {
            return request({
                url: prefix + "setCustomTranslation",
                data:{tag,translation,type},
            }).then(res=>{
                if (res.code === 2000) {
                    ElMessage.success(res.message)
                }else{
                    ElMessage.error(res.message)

                }
            })
        },
        method: ({dispatch, commit, state}, payload) => {

        },

    },
    getters: {
        getParams(state) {
            return copyObj(state.params)
        }
    },
}