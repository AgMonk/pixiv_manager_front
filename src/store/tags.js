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
            }).then(res => {
                if (res.code === 2000) {
                    const data = res.data;

                    data.records.forEach(item => {
                        if (item.examples && item.examples.length > 0) {
                            item.examples = item.examples.map(i => {
                                let index = i.lastIndexOf('/') + 1;
                                const s1 = i.substring(0, index);
                                const s2 = encodeURIComponent(i.substring(index));
                                return s1 + s2;
                            })
                        }
                    })

                    return data;
                }
                throw res.message;
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