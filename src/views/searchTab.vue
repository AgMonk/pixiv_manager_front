<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div style="text-align: left;color:white">
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="editKeyword">修改关键字</el-button>
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="findPage(true)">刷新</el-button>
        <filter-bookmarked @change="findPage(false)"/>
      </div>
      <el-pagination v-model:current-page="p"
                     v-model:page-size="size"
                     :total="total"
                     layout="total,prev, pager, next, jumper"
                     @current-change="currentChanged"/>

    </el-header>

    <el-main v-loading="loading">
      <div v-if="!loading">
        <illust-cards v-if="result.data" :data="result.data"
                      @bookmark-add-success="bookmarkStatusChanged"
                      @bookmark-del-success="bookmarkStatusChanged"/>

      </div>
    </el-main>

  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import IllustCards from "@/components/illust-cards";
import {setTitle} from "@/assets/js/projectUtils";
import {addDomains} from "@/assets/js/pixivUtils";
import FilterBookmarked from "@/components/filter-bookmarked";
import {ElMessage, ElMessageBox} from "element-plus";

// noinspection JSCheckFunctionSignatures
export default {
  name: "searchTab",
  components: {FilterBookmarked, IllustCards},
  data() {
    return {
      loading: false,
      total: 100,
      p: 1,
      k: '',
      size: 60,
      result: [],
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`, `getSearch`]),
    ...mapMutations(`pixivSearch`, [`delCache`]),
    bookmarkStatusChanged() {
      this.delCache({
        keyword: this.k,
        p: this.p,
      })
    },
    currentChanged(e) {
      this.$router.push(`/search/${this.k}/${e}`);
    },
    editKeyword() {
      ElMessageBox.prompt('修改搜索关键字', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: this.k,
      }).then(({value}) => {
        ElMessage.success('修改成功');
        this.$emit("keyword-changed", {before: this.k, after: value})
      }).catch(() => {
        ElMessage.info('已取消');
      })
    },
    findPage(force) {
      this.loading = true
      const method = force ? this.getSearch : this.findSearch;
      const p = this.p;
      const keyword = this.k;
      const title = `搜索 ${keyword} 第 ${p} 页`;

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
    init({keyword, page}) {
      this.p = parseInt(page);
      this.k = keyword;
      this.findPage(false)
    },
  }
  ,
  mounted() {
    // noinspection JSCheckFunctionSignatures
    this.init(this.$route.params);
  }
  ,
  watch: {
    '$route': {
      handler: function (e) {
        if (e.path.startsWith('/search')) {
          this.init(e.params)
        }
      }
    }
  }
  ,
  props: {}
  ,
}

</script>

<style scoped>

</style>