import { createStore } from 'vuex'
import tags from "@/store/tags";
import config from "@/store/config";
import pixivIllust from "@/store/pixivIllust";
import pixivFollow from "@/store/pixivFollow";
import pixivUser from "@/store/pixivUser";
import bookmark from "@/store/bookmark";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tags,config,pixivIllust,pixivFollow,pixivUser,bookmark
  },

})
