<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-input v-model="keyword" style="width:300px" size="mini" @keypress.enter="goRouter(keyword,1)"/>
      <el-button type="primary" @click="goRouter(keyword,1)" size="mini">搜索</el-button>
      <filter-bookmarked @change="findPage(false)"/>
      <el-pagination layout="total,prev, pager, next, jumper"
                     :total="total"
                     v-model:page-size="size"
                     @current-change="goRouter(keyword,$event)"
                     v-model:current-page="page"/>
    </el-header>
    <el-main v-loading="loading">
      <div v-if="!loading">
        <el-row>
          <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
                  v-for="item in result.data">
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
import {setTitle} from "@/assets/js/projectUtils";
import {addDomains} from "@/assets/js/pixivUtils";
import IllustCard from "@/components/illust-card";
import FilterBookmarked from "@/components/filter-bookmarked";

export default {
  name: "search",
  components: {FilterBookmarked, IllustCard},
  data() {
    return {
      page: 1,
      size: 60,
      total: 100,
      loading: false,
      keyword: '',
      filterBookmarked: false,
      result: {},
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`, `getSearch`]),
    goRouter(keyword,page){
      this.$router.push(`/search/${keyword}/${page}`)
      this.findPage(false)
    },
    findPage(force) {
      this.loading = true
      const method = force ? this.getSearch : this.findSearch;
      const p = this.page;
      const keyword = this.keyword;
      const title = `搜索 ${keyword} 第 ${p} 页`;

      return method({keyword, p}).then(res => {
        const domain = this.config.imgDomain;
        addDomains(res.data, domain)
        addDomains(res.popular.recent, domain)
        addDomains(res.popular.permanent, domain)

        this.total = res.total;
        if (this.config.filterBookmarked) {
          res.data = res.data.filter(i => !i.bookmarkData)
          res.popular.recent = res.popular.recent.filter(i => !i.bookmarkData)
          res.popular.permanent = res.popular.permanent.filter(i => !i.bookmarkData)
        }

        console.log(res)
        this.result = res;
        this.loading = false
      }).catch(res => {
        console.log(res)
        this.loading = false;
      })
    },
  },
  mounted() {
    this.filterBookmarked = this.config.filterBookmarked;
    this.keyword = this.$route.params.keyword;
    // noinspection JSCheckFunctionSignatures
    this.page = parseInt(this.$route.params.page);

    this.findPage(false)

  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>