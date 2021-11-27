<!--关注用户的作品-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="findPage(true)" size="mini">刷新</el-button>
      <span style="color:white">过滤已收藏:</span>
      <el-switch
          v-model="filterBookmarked"
          @change="switchFilterBookmarked"
          style="margin-left: 24px"
          inline-prompt
          active-icon="是"
          inactive-icon="否"
      />
      <el-pagination layout="prev, pager, next, jumper"
                     :page-count="65535"
                     :pager-count="9"
                     @current-change="goPage"
                     v-model:current-page="page"/>
    </el-header>
    <el-main v-loading="loading">
      <div v-if="!loading">
        <el-row>
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
                  v-for="item in illust">
            <illust-card :data="item"/>
          </el-col>
        </el-row>

      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {copyObj} from "@/assets/js/utils";
import {addDomains} from "@/assets/js/pixivUtils";

export default {
  name: "followLatest",
  components: {IllustCard},
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
    ...mapMutations(`config`, [`setConfig`]),
    goPage(e) {
      this.$router.push(`/follow-latest/${e}`)
    },
    switchFilterBookmarked(e) {
      this.setConfig({key: 'filterBookmarked', value: e})
      this.findPage(false)
    },
    findPage(force) {
      this.page = parseInt(this.$route.params.page);
      this.loading = true;
      const method = force ? this.getFollowLatest : this.findFollowLatest;
      method(this.page).then(res => {
        this.illust = copyObj(res);

        addDomains(this.illust,this.config.imgDomain)

        if (this.filterBookmarked) {
          this.illust = this.illust.filter(i => !i.bookmarkData)
        }
        console.log(this.illust)
        this.loading = false;
      }).catch(reason => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.findPage(false);
    this.filterBookmarked = this.config.filterBookmarked;
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