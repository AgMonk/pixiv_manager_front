<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-input v-model="keyword" style="width:300px" size="mini" @keypress.enter="goRouter(keyword,1)"/>
      <el-button type="primary" v-if="keyword!==$route.params.keyword" @click="goRouter(keyword,1)" size="mini">搜索</el-button>
      <el-button type="primary" v-if="keyword===$route.params.keyword" @click="findPage(true)" size="mini">刷新</el-button>
      <!--     保存搜索、选择已保存的搜索-->
      <el-dropdown split-button type="primary" @click="saveKeyword" @command="goRouter($event,1)" size="mini">
        <template #default>
          <span v-if="keywords.includes(keyword)">移除</span>
          <span v-else>保存</span>
        </template>
        <!--suppress HtmlUnknownAttribute -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in keywords" :command="item">{{ item }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <filter-bookmarked @change="findPage(false)"/>
    </el-header>
    <el-main >
      <search-result v-if="keyword" :keyword="keyword" :page="page" />
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/js/projectUtils";
import {addDomains} from "@/assets/js/pixivUtils";
import IllustCard from "@/components/illust-card";
import FilterBookmarked from "@/components/filter-bookmarked";
import {copyObj} from "@/assets/js/utils";
import IllustCards from "@/components/illust-cards";
import SearchResult from "@/components/search-result";

export default {
  name: "search",
  components: {SearchResult, IllustCards, FilterBookmarked, IllustCard},
  data() {
    return {
      page: 1,
      keyword: '',
      filterBookmarked: false,
      result: {},
      keywords: [],
    }
  },
  emits: ['bookmark-add-success', 'bookmark-del-success'],
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`, `getSearch`]),
    ...mapMutations(`config`, [`setConfig`]),
    ...mapMutations(`pixivSearch`, [`delCache`]),
    bookmarkStatusChanged(e) {
      this.delCache({
        keyword:this.keyword,
        p:this.page,
      })
    },
    saveKeyword() {
      if (this.keywords.includes(this.keyword)) {
        //  移除
        this.keywords = this.keywords.filter(i => i !== this.keyword);
        console.log(this.keywords)
      } else {
        //  保存
        this.keywords.push(this.keyword)
      }
      this.setConfig({key: 'keywords', value: this.keywords,})
    },
    goRouter(keyword, page) {
      this.$router.push(`/search/${keyword}/${page}`)
    },
    findPage(force) {
      this.loading = true
      const method = force ? this.getSearch : this.findSearch;
      const p = this.page;
      const keyword = this.keyword;
      const title = `搜索 ${keyword} 第 ${p} 页`;
      console.log(title)
      setTitle(title)

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
    init() {
      this.keyword = this.$route.params.keyword;
      // noinspection JSCheckFunctionSignatures
      this.page = parseInt(this.$route.params.page);
      // this.findPage(false)
    },
  },
  mounted() {
    this.filterBookmarked = this.config.filterBookmarked;
    this.keywords = this.config.keywords ? copyObj(this.config.keywords) : [];

    this.init();
  },
  watch: {
    '$route': {
      handler: function (e) {
        console.log(e)
        if (e.path.startsWith('/search/')) {
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