<!--关注用户的作品-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="findPage(true)" size="mini">刷新</el-button>
      <filter-bookmarked @change="findPage(false)" />
      <el-pagination layout="prev, pager, next, jumper"
                     :page-count="65535"
                     :pager-count="9"
                     @current-change="goPage"
                     v-model:current-page="page"/>
    </el-header>
    <el-main v-loading="loading">
      <div v-if="!loading">
        <illust-cards v-if="illust" :data="illust"
                      @bookmark-add-success="delCache(page)"
                      @bookmark-del-success="delCache(page)" />
      </div>
    </el-main>

  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {copyObj} from "@/assets/js/utils";
import {addDomains} from "@/assets/js/pixivUtils";
import {setTitle} from "@/assets/js/projectUtils";
import FilterBookmarked from "@/components/filter-bookmarked";
import IllustCards from "@/components/illust-cards";

export default {
  name: "followLatest",
  components: {IllustCards, FilterBookmarked, IllustCard},
  data() {
    return {
      page: 1,
      loading: true,
      filterBookmarked: false,
      illust: [],
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivFollowLatest', [`findFollowLatest`, `getFollowLatest`]),
    ...mapMutations(`pixivFollowLatest`,[`delCache`] ),
    goPage(e) {
      this.$router.push(`/follow-latest/${e}`)
    },
    findPage(force) {
      this.page = parseInt(this.$route.params.page);
      this.loading = true;
      const method = force ? this.getFollowLatest : this.findFollowLatest;
      method(this.page).then(res => {
        this.illust = copyObj(res);

        addDomains(this.illust,this.config.imgDomain)

        if (this.config.filterBookmarked) {
          this.illust = this.illust.filter(i => !i.bookmarkData)
        }
        console.log(this.illust)
        this.loading = false;
      }).catch(reason => {
        console.log(reason)
        this.loading = false;
      })
    }
  },
  mounted() {
    setTitle('我的关注作品')

    this.findPage(false);
  },
  watch: {
    "$route": {
      handler: function (e) {
        if (e.fullPath.startsWith("/follow-latest")) {
          this.findPage(false);
        }
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>