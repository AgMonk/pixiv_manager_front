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
          <filter-bookmarked @change="findPage(false)"/>
          <el-pagination layout="total,prev, pager, next, jumper"
                         :total="total"
                         v-model:page-size="size"
                         @current-change="goPage"
                         v-model:current-page="page"/>
        </el-header>

        <el-main v-loading="loading">
          <illust-cards v-if="!loading && illust && illust.length>0" :data="illust"
                        @bookmark-add-success="bookmarkStatusChanged"
                        @bookmark-del-success="bookmarkStatusChanged"/>
        </el-main>

      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";
import FollowButton from "@/components/follow-button";
import UserAvatar from "@/components/user-avatar";
import {addDomains} from "@/assets/js/pixivUtils";
import {setTitle} from "@/assets/js/projectUtils";
import FilterBookmarked from "@/components/filter-bookmarked";
import IllustCards from "@/components/illust-cards";

export default {
  name: "userIllustManga",
  components: {IllustCards, FilterBookmarked, UserAvatar, FollowButton},
  data() {
    return {
      loading: false,
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
    ...mapActions('pixivUserIllust', [`findProfileAll`, `findProfileIllusts`, `getProfileIllusts`]),
    ...mapActions("pixivUser", [`findUserInfo`, `getUserInfo`]),
    ...mapActions("pixivBookmark", [`findBookmark`, `getBookmark`]),
    ...mapMutations(`pixivBookmark`, {
      'delBookmarkCache': 'delCache',
    }),
    ...mapMutations(`pixivUserIllust`, {
      'delUserIllustCache': 'delCache',
    }),
    bookmarkStatusChanged(e) {
      console.log(e)
      if (this.type === 'bookmark') {
        this.delBookmarkCache({
          uid: this.user.userId,
          tag: this.tag,
          page: this.page,
          size: this.size,
        })
      } else {
        this.delUserIllustCache({
          uid: this.user.userId,
          work_category: this.type,
          page: this.page,
          size: this.size,
        })
      }
    },
    goPage(e) {
      this.$router.push(`/user/${this.$route.params.userId}/${this.type}/${e}`)
    },
    findPage(force) {
      this.loading = true
      if (['illust', 'manga'].includes(this.type)) {
        return this.findProfileIllusts({
          uid: this.$route.params.userId,
          page: this.page,
          size: this.size,
          work_category: this.$route.params.type,
          force
        }).then(res => {
          this.illust = copyObj(res)

          addDomains(this.illust, this.config.imgDomain)


          if (this.config.filterBookmarked) {
            this.illust = this.illust.filter(i => !i.bookmarkData)
          }
          console.log(this.illust)
          this.loading = false
          return res;
        }).catch(res => {
          console.log(res)
        })
      } else if ('bookmark' === this.type) {
        return this.findBookmark({
          uid: this.$route.params.userId,
          tag: this.tag,
          page: this.page,
          force,
        }).then(res => {
          console.log(res)
          this.total = res.total
          this.totalCount.bookmark = res.total
          this.illust = copyObj(res.works)
          addDomains(this.illust, this.config.imgDomain)

          if (this.filterBookmarked && this.$route.params.userId !== this.config.uid) {
            this.illust = this.illust.filter(i => !i.bookmarkData)
          }
          console.log(this.illust)
          this.loading = false
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
      this.findProfileAll({force, uid: this.$route.params.userId}).then(res => {
        console.log(res)
        this.loading = false
        this.totalCount.illust = Object.keys(res['illust']).length;
        this.totalCount.manga = Object.keys(res['manga']).length;
        //插画和漫画时 请求数据
        if (['illust', 'manga'].includes(this.type)) {
          this.total = Object.keys(res[this.type]).length;
        }
        this.findPage(force)
      })

      this.findUserInfo({force, uid: this.$route.params.userId}).then(res => {
        this.user = copyObj(res);
        this.user.image = this.config.imgDomain + this.user.image
        this.user.imageBig = this.config.imgDomain + this.user.imageBig
        console.log(this.user)

        let type;
        switch (this.$route.params.type) {
          case 'illust':
            type = '插画';
            break;
          case 'manga':
            type = '漫画';
            break;
          case 'bookmark':
            type = '收藏';
            break;
        }
        setTitle(`${this.user.name}的${type}`)
      })
    }
  },
  mounted() {
    console.clear()


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