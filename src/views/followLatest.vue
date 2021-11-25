<!--关注用户的作品-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="refresh(true)" size="mini">刷新</el-button>
      <el-pagination layout="prev, pager, next, jumper"
                     :page-count="65535"
                     :pager-count="9"
                     @current-change="goPage"
                     v-model:current-page="page" />
    </el-header>
    <el-main v-loading="loading">
      <div v-if="!loading">
        <el-row>
          <el-col v-for="item in illust" :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
            <illust-card :data="item"/>
          </el-col>
        </el-row>

      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "followLatest",
  components: {IllustCard},
  data() {
    return {
      page:1,
      loading: true,
      illust: [],
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivFollowLatest', [`findFollowLatest`, `getFollowLatest`]),
    goPage(e){
      this.$router.push(`/follow-latest/${e}`)
    },
    refresh(force) {
      this.page = parseInt(this.$route.params.page);
      this.loading = true;
      const method = force ? this.getFollowLatest : this.findFollowLatest;
      method(this.page).then(res => {
        this.illust = copyObj(res);
        this.illust.forEach(item => {
          item.url = this.config.imgDomain + item.url
          item.profileImageUrl = this.config.imgDomain + item.profileImageUrl
        })
        console.log(this.illust)
        this.loading = false;
      }).catch(reason => {
        this.loading = false;
      })
    }
  },
  mounted() {
    this.refresh(false);
  },
  watch: {
    "$route":{
      handler:function (e) {
        this.refresh(false);
      }
    }
  },
  props: {},
}

</script>

<style scoped>

</style>