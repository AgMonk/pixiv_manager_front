<template>

  <el-container direction="vertical">
    <el-header height="100px" style="text-align: left" v-if="author">
      <el-avatar :size="100" v-if="author.hasOwnProperty('imageBig')" :src="author.imageBig"/>
      <span style="color:white;font-size: 35px;">{{author.name}}</span>
      <follow-button
          style="margin-left: 20px"
          size="medium"
          v-if="author && author.hasOwnProperty('isFollowed')"
          :uid="author.userId"
          :token="config.token"
          :is-followed="author.isFollowed"
          @follow-success="author.isFollowed = true"
          @unfollow-success="author.isFollowed = false"
      />
    </el-header>
    <el-main>
      <el-container direction="vertical">
        <!--  <el-container direction="horizontal">-->
        <el-header>
          <el-button type="primary" @click="init(true)" size="mini">刷新</el-button>
          <span style="color:white">过滤已收藏:</span>
          <el-switch
              v-model="filterBookmarked"
              @change="switchFilterBookmarked"
              style="margin-left: 24px"
              inline-prompt
              active-icon="是"
              inactive-icon="否"
          />
          <el-pagination layout="total,prev, pager, next, jumper"
                         :total="total"
                         v-model:page-size="size"
                         @current-change="goPage"
                         v-model:current-page="page"/>
        </el-header>

        <el-main v-loading="loading">
          <el-row>
            <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
                    v-for="item in illust">
              <illust-card :data="item" disableAvatar/>
            </el-col>
          </el-row>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {copyObj} from "@/assets/js/utils";
import FollowButton from "@/components/follow-button";

export default {
  name: "userIllustManga",
  components: {FollowButton, IllustCard},
  data() {
    return {
      loading: false,
      filterBookmarked: false,
      page: 1,
      size: 48,
      total:100,
      illust: [],
      author:{},
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`setConfig`]),
    ...mapActions('pixivUserIllust', [`findProfileAll`, `findProfileIllusts`,`getProfileIllusts`]),
    ...mapActions("pixivUser", [`findUserInfo`, `getUserInfo`]),
    goPage(e) {
      this.$router.push(`/user/${this.$route.params.userId}/${this.$route.params.type}/${e}`)
    },
    switchFilterBookmarked(e){
      this.setConfig({key:'filterBookmarked',value:e})
      this.findPage(false)
    },
    findPage(force) {
      const method = force?this.getProfileIllusts:this.findProfileIllusts;
      this.loading = true
      return method({
        uid: this.$route.params.userId,
        page: this.page,
        size: this.size,
        work_category: this.$route.params.type
      }).then(res => {
        this.loading = false
        this.illust = copyObj(res)
        this.illust.forEach(i => i.url = this.config.imgDomain + i.url)
        if (this.filterBookmarked){
          this.illust = this.illust.filter(i=>!i.bookmarkData)
        }
        console.log(res)
        return res;
      })
    },
    init(force) {
      // noinspection JSCheckFunctionSignatures
      this.page = parseInt(this.$route.params.page)
      this.loading = true
      this.findProfileAll(this.$route.params.userId).then(res => {
        console.log(res)
        this.loading = false
        this.total = Object.keys(res[this.$route.params.type]).length;
        this.findPage(force)
      })

      this.findUserInfo(this.$route.params.userId).then(res=>{
        this.author = copyObj(res);
        this.author.image = this.config.imgDomain+this.author.image
        this.author.imageBig = this.config.imgDomain+this.author.imageBig
        console.log(this.author)
      })
    }
  },
  mounted() {
    this.filterBookmarked = this.config.filterBookmarked;
    this.init();
  },
  watch: {
    '$route': {
      handler: function (e) {
        if (e.path.startsWith('/user')) {
          this.init()
        }
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>