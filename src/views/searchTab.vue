<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <div style="text-align: left;color:white">
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="editKeyword">修改关键字</el-button>
        <el-button size="mini" style="margin-left: 25px" type="primary" @click="findPage(true)">刷新</el-button>
        <filter-bookmarked @change="findPage(false)" />
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
        <span style="margin-left: 25px">
          <span style="color:white">自动重试:</span>
          <el-switch
              v-model="autoRetry"
              active-icon="是"
              inactive-icon="否"
              inline-prompt
              style="margin-left: 24px"
              @change="findPage(false)"
          />
        </span>
        <span style="margin-left: 25px">
          <span style="color:white">日期范围:</span>
          <el-date-picker
              v-model="dateRange"
              clearable
              end-placeholder="结束"
              range-separator="到"
              size="small"
              start-placeholder="起始"
              type="daterange"
              value-format="YYYY-MM-DD"
              @change="findPage(false)"
          />
        </span>
      </div>
      <el-pagination v-model:current-page="p"
                     v-model:page-size="size"
                     :total="total"
                     layout="total,prev, pager, next, jumper"
                     @current-change="currentChanged"
      />

    </el-header>

    <el-main v-loading="loading">
      <div v-if="!loading">
        <illust-cards v-if="result.data" :data="result.data"
                      @bookmark-add-success="bookmarkStatusChanged"
                      @bookmark-del-success="bookmarkStatusChanged"
        />

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
      autoRetry: true,
      blackListCount: 0,
      dateRange: undefined,
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions('pixivSearch', [`findSearch`]),
    ...mapMutations(`pixivSearch`, [`delCache`]),
    bookmarkStatusChanged() {
      const [scd, ecd] = this.dateRange
      this.delCache({
        keyword: this.k,
        p: this.p,
        scd, ecd,
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
      const param = {keyword, p, force}
      if (this.dateRange) {
        const [scd, ecd] = this.dateRange
        param.scd = scd
        param.ecd = ecd
      }

      return this.findSearch(param).then(res => {
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
            return !blackUserId.includes(i.userId)
                && !i.userName.includes('资源')
                && !i.userName.includes('详情')
                && !i.userName.includes('王者')
                ;
          })
          const after = res.data.length
          this.blackListCount = before - after
        }

        console.log(res)
        this.result = res;
        this.loading = false
      }).catch(res => {
        console.error(res + " " + title)
        // if (res.includes('请求超时')) {
        if (this.autoRetry) {
          ElMessage.error('请求失败，稍后自动重试')
          setTimeout(() => {
            this.findPage(force)
          }, 3000)
        }
        // } else {
        //   ElMessage.error(res)
        this.loading = false;
        // }
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
    const now = new Date()
    const d0 = now.format("yyyy-MM-dd")
    const yesterday = new Date(now.getTime() - 1000 * 60 * 60 * 24)
    const d1 = yesterday.format("yyyy-MM-dd")
    this.dateRange = this.dateRange ? this.dateRange : [d1, d0]
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