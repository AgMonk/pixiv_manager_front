<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <!-- 保存的搜索关键字-->
      <el-tabs
          v-model="currentTab"
          editable
          type="card"
          @edit="tabEdit"
          @tab-click='tabClick'
      >
        <el-tab-pane
            v-for="item in keywords"
            :key="item"
            :label="item.substring(0,Math.min(6,item.length))"
            :name="item"
        >
          <!--suppress HtmlUnknownAttribute -->
          <template #label>
            <span :class="item===currentTab?'tabSelected':'tabNotSelected'">
              <span v-if="item.length>6">{{ item.substring(0, 6) }}..</span>
              <span v-else>{{ item }}</span>
            </span>
          </template>
          <router-view v-if="item===currentTab" @keyword-changed="keywordChanged"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "search",
  computed: {
    ...mapState(`config`, [`config`])
  },
  data() {
    return {
      currentTab: '',
      keywords: [],
    }
  },
  methods: {
    ...mapMutations(`config`, [`setConfig`]),
    tabClick() {
      this.$router.push(`/search/${this.currentTab}/1`)

    },
    keywordChanged(e) {
      console.log(e)
      this.keywords = this.keywords.filter(i => i !== e.before);
      this.keywords.push(e.after)
      this.currentTab = e.after;
    },
    tabEdit(name, action) {
      if (action === 'remove') {
        this.$confirm(`确定移除搜索 ${name} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.keywords = this.keywords.filter(i => i !== name);
          if (this.currentTab === name) {
            this.$router.push(`/search/${this.keywords[0]}/1`)
            this.currentTab = this.keywords[0];
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }

      if (action === 'add') {
        this.$prompt('请输入关键字', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({value}) => {
          this.keywords.push(value)
          this.currentTab = value;
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  },
  mounted() {
    this.keywords = this.config.keywords;

    const {keyword, page} = this.$route.params

    if (!keyword || !page) {
      this.currentTab = this.config.keyword;
      this.$router.push(`/search/${this.currentTab}/1`)
    } else {
      this.currentTab = keyword;
      if (!this.keywords.includes(this.currentTab)) {
        this.keywords.push(this.currentTab)
      }
    }
  },
  watch: {
    "keywords": {
      handler: function (e) {
        this.setConfig({key: 'keywords', value: e,})
      }
    },
    "currentTab": {
      handler: function (e) {
        this.setConfig({key: 'keyword', value: e,})
      }
    }
  },
  props: {},
}

</script>

<style scoped>
.tabNotSelected {
  color: #ffd6d6
}
</style>