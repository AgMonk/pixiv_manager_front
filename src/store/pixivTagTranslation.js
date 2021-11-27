// 标签翻译管理
export default {
    namespaced: true,
    state: {
        translation: {},
    },
    mutations: {
        setTranslation(state, {key, value}) {
            if (key && value) {
                console.log(`设置翻译 ${key} -> ${value}`)
                state.translation[key] = value;
            }
        }
    },
    actions: {
        method: ({dispatch, commit, state}, payload) => {

        },
        // getTranslation: ({dispatch, commit, state}, key) => {
        //     return state.translation.hasOwnProperty(key) ? state.translation[key] : key;
        // },

    },
    getters: {
        getAllTranslations(state){
            return state.translation;
        }
    },
}