<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div style="text-align: left;color:white">
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="editKeyword">修改关键字</el-button>
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="findPage(true)">刷新</el-button>
        <filter-bookmarked @change="findPage(false)"/>
        <span style="margin-left: 25px">
          <span style="color:white">过滤黑名单:</span>
          <el-switch
              v-model="filterBlackList"
              active-icon="是"
              inactive-icon="否"
              inline-prompt
              style="margin-left: 24px"
              @change="findPage(false)"
          />
          <span v-if="blackListCount>0" style="margin-left: 25px">已屏蔽 {{ blackListCount }} 个作品</span>
        </span>
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
      result: {},
      filterBlackList: true,
      blackListCount: 0,
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`]),
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
      }).catch(res => {
        console.log(res)
        ElMessage.info('已取消');
      })
    },
    findPage(force) {
      this.loading = true
      this.result = {};
      const p = this.p;
      const keyword = this.k;
      const title = `搜索 ${keyword} 第 ${p} 页`;

      setTitle(title)

      return this.findSearch({keyword, p, force}).then(res => {
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

        //黑名单过滤
        if (this.filterBlackList && this.config && this.config.blackList && this.config.blackList.user) {
          const blackUserId = Object.keys(this.config.blackList.user);
          const before = res.data.length
          res.data = res.data.filter(i => {
            return !blackUserId.includes(i.userId) && !i.userName.includes('资源');
          })
          const after = res.data.length
          this.blackListCount = before - after
        }

        console.log(res)
        this.result = res;
        this.loading = false
      }).catch(res => {
        console.error(res + " " + title)
        ElMessage.error(res)
        this.loading = false;
      })
    },
    init({keyword, page}) {
      console.clear()
      this.p = parseInt(page);
      this.k = keyword;
      this.findPage(false)
    },
  }
  ,
  mounted() {
    // noinspection JSCheckFunctionSignatures
    this.init(this.$route.params)
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