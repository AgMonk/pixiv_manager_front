import {createStore} from 'vuex'
import tags from "@/store/tags";
import config from "@/store/config";
import pixivIllust from "@/store/pixivIllust";
import pixivFollow from "@/store/pixivFollow";
import pixivUser from "@/store/pixivUser";
import pixivBookmark from "@/store/pixivBookmark";
import pixivFollowLatest from "@/store/pixivFollowLatest";
import pixivUserIllust from "@/store/pixivUserIllust";
import pixivTagTranslation from "@/store/pixivTagTranslation";
import pixivSearch from "@/store/pixivSearch";
import pixivDiscovery from "@/store/pixivDiscovery";

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    tags, config, pixivIllust, pixivFollow, pixivUser, pixivBookmark, pixivFollowLatest, pixivUserIllust, pixivTagTranslation, pixivSearch, pixivDiscovery
  },

})
