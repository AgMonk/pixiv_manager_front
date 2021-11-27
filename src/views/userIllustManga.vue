<template>

  <el-container direction="vertical">
    <el-header height="100px" style="text-align: left" v-if="user">
      <user-avatar :user="user"/>
    </el-header>
    <el-main>
      <!--      插画 漫画切换-->
      <el-radio-group v-model="type" @change="goPage(1)">
        <el-radio-button label="illust" :disabled="totalCount.illust===0">插画({{ totalCount.illust }})</el-radio-button>
        <el-radio-button label="manga" :disabled="totalCount.manga===0">漫画({{ totalCount.manga }})</el-radio-button>
        <el-radio-button label="bookmark">收藏({{ totalCount.bookmark }})</el-radio-button>
      </el-radio-group>
      <el-container direction="vertical" style="margin-top: 20px">
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
          <el-row v-if="!loading">
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
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {copyObj} from "@/assets/js/utils";
import FollowButton from "@/components/follow-button";
import UserAvatar from "@/components/user-avatar";
import {addDomains} from "@/assets/js/pixivUtils";

export default {
  name: "userIllustManga",
  components: {UserAvatar, FollowButton, IllustCard},
  data() {
    return {
      loading: false,
      filterBookmarked: false,
      page: 1,
      size: 48,
      total: 100,
      illust: [],
      type: '',
      tag: '',
      user: {},
      totalCount: {
        illust: 0,
        manga: 0,
        bookmark: 0,
      }
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`setConfig`]),
    ...mapActions('pixivUserIllust', [`findProfileAll`, `findProfileIllusts`, `getProfileIllusts`]),
    ...mapActions("pixivUser", [`findUserInfo`, `getUserInfo`]),
    ...mapActions("pixivBookmark", [`findBookmark`, `getBookmark`]),
    ...mapGetters('pixivTagTranslation',[`getAllTranslations`]),
    goPage(e) {
      this.$router.push(`/user/${this.$route.params.userId}/${this.type}/${e}`)
    },
    switchFilterBookmarked(e) {
      this.setConfig({key: 'filterBookmarked', value: e})
      this.findPage(false).catch(res => {
        this.loading = false
      })
    },
    findPage(force) {
      this.loading = true
      if (['illust', 'manga'].includes(this.type)) {
        const method = force ? this.getProfileIllusts : this.findProfileIllusts;
        return method({
          uid: this.$route.params.userId,
          page: this.page,
          size: this.size,
          work_category: this.$route.params.type
        }).then(res => {
          const translation =this.getAllTranslations();
          this.loading = false
          this.illust = copyObj(res)

          addDomains(this.illust,this.config.imgDomain)

          this.illust.forEach(i => {
            i.tagTranslation = i.tags.map(t=> {
              return {key: t, value:translation[t]}
            })
          })

          if (this.filterBookmarked) {
            this.illust = this.illust.filter(i => !i.bookmarkData)
          }
          console.log(this.illust)
          return res;
        }).catch(res => {
          console.log(res)
        })
      } else if ('bookmark' === this.type) {
        const method = force ? this.getBookmark : this.findBookmark;
        return method({
          uid: this.$route.params.userId,
          tag: this.tag,
          page: this.page,
        }).then(res => {
          console.log(res)
          this.loading = false
          this.total = res.total
          this.totalCount.bookmark = res.total
          this.illust = copyObj(res.works)
          addDomains(this.illust,this.config.imgDomain)

          if (this.filterBookmarked && this.$route.params.userId !== this.config.uid) {
            this.illust = this.illust.filter(i => !i.bookmarkData)
          }
          console.log(this.illust)
        }).catch(res => {
          this.loading = false
          console.log(res)
        })
      }
    },
    init(force) {
      // noinspection JSCheckFunctionSignatures
      this.page = parseInt(this.$route.params.page)
      this.type = this.$route.params.type;

      this.loading = true
      this.findProfileAll(this.$route.params.userId).then(res => {
        console.log(res)
        this.loading = false
        this.totalCount.illust = Object.keys(res['illust']).length;
        this.totalCount.manga = Object.keys(res['manga']).length;
        //插画和漫画时 请求数据
        if (['illust', 'manga'].includes(this.type)) {
          this.total = Object.keys(res[this.type]).length;
        }
        this.findPage(force).catch(res => {
          this.loading = false
        })
      })

      this.findUserInfo(this.$route.params.userId).then(res => {
        this.user = copyObj(res);
        this.user.image = this.config.imgDomain + this.user.image
        this.user.imageBig = this.config.imgDomain + this.user.imageBig
        console.log(this.user)
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