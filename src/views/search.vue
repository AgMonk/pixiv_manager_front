<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="findPage(true)" size="mini">刷新</el-button>
      <filter-bookmarked @change="findPage(false)" />
      <el-pagination layout="total,prev, pager, next, jumper"
                     :total="total"
                     v-model:page-size="size"
                     @current-change="goPage"
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
      page:1,
      size:60,
      total:100,
      loading:false,
      filterBookmarked:false,
      result:{},
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`,`getSearch`]),
    goPage(e) {
      const keyword = this.$route.params.keyword;
      this.$router.push(`/search/${keyword}/${e}`)
    },
    findPage(force){
      const method = force ? this.getSearch:this.findSearch;
      const p = this.$route.params.page;
      const keyword = this.$route.params.keyword;
      const title = `搜索 关键字: ${keyword} 第 ${p} 页`;
      console.log(title)
      setTitle(title)

      return method({keyword,p}).then(res=>{
        const domain = this.config.imgDomain;
        addDomains(res.data,domain)
        addDomains(res.popular.recent,domain)
        addDomains(res.popular.permanent,domain)

        this.total = res.total;
        if (this.config.filterBookmarked){
          res.data = res.data.filter(i => !i.bookmarkData)
          res.popular.recent = res.popular.recent.filter(i => !i.bookmarkData)
          res.popular.permanent = res.popular.permanent.filter(i => !i.bookmarkData)
        }

        console.log(res)
        this.result = res;
      })
    },
  },
  mounted() {
    this.findPage(false)

    this.filterBookmarked = this.config.filterBookmarked;

  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>