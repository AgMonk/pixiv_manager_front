import { createStore } from 'vuex'
import tags from "@/store/tags";
import config from "@/store/config";
import illust from "@/store/illust";
import pixivFollow from "@/store/pixivFollow";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tags,config,illust,pixivFollow
  },

})
