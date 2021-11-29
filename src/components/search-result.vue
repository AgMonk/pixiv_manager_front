<!--搜索结果-->
<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div style="text-align: left;color:white">
        <span>搜索: {{ k }}</span>
        <el-button type="primary" @click="editKeyword" size="mini" style="margin-left: 25px">修改</el-button>
        <el-button type="primary" @click="findPage(true)" size="mini" style="margin-left: 25px">刷新</el-button>
        <filter-bookmarked @change="findPage(false)"/>
      </div>
      <el-pagination layout="total,prev, pager, next, jumper"
                     :total="total"
                     v-model:page-size="size"
                     @current-change="p=$event;findPage(false)"
                     v-model:current-page="p"/>

    </el-header>

    <el-main v-loading="loading">
      <div v-if="!loading">
        <illust-cards v-if="result.data" :data="result.data"
                      @bookmark-add-success="bookmarkStatusChanged"
                      @bookmark-del-success="bookmarkStatusChanged"/>

      </div>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import IllustCards from "@/components/illust-cards";
import {setTitle} from "@/assets/js/projectUtils";
import {addDomains} from "@/assets/js/pixivUtils";
import FilterBookmarked from "@/components/filter-bookmarked";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "search-result",
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
    bookmarkStatusChanged(e) {
      this.delCache({
        keyword: this.k,
        p: this.p,
      })
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
      this.$emit('page-changed', {keyword, p})
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
      this.p = this.page;
      this.k = this.keyword;
      this.findPage(false)
    },
  }
  ,
  mounted() {
    this.init();
  }
  ,
  watch: {
    "keyword":
        {
          handler: function (e) {
            this.init()
          }
        }
    ,
    "page":
        {
          handler: function (e) {
            this.init()
          }
        }
    ,

  }
  ,
  props: {
    keyword: {
      required: true,
      type
:
String,
}
,
page: {
  required: true,
      type
:
  Number,
default:
  1,
}
}
,
}

</script>

<style scoped>

</style>