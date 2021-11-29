<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
<!--    <el-header></el-header>-->

    <el-main>
      <el-tabs
          v-model="currentTab"
          type="card"
          editable
          @edit="tabEdit"
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
          <search-result v-if="item===currentTab" :keyword="item" :page="1"/>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import {setTitle} from "@/assets/js/projectUtils";
import SearchResult from "@/components/search-result";

export default {
  name: "searchTabs",
  components: {SearchResult},
  data() {
    return {
      currentTab: '',
      keywords: [],
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`setConfig`]),
    tabEdit(name, action) {
      if (action === 'remove') {
        this.$confirm(`确定移除搜索 ${name} ?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.keywords = this.keywords.filter(i => i !== name);
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
    this.currentTab = this.config.keyword;
  },
  watch: {
    "keywords": {
      handler: function (e) {
        this.setConfig({key: 'keywords', value: e,})
      }
    },
    "currentTab": {
      handler: function (e) {
        setTitle('搜索: ' + e)
        this.setConfig({key: 'keyword', value: e,})
      }
    }
  },
  props: {},
}

</script>

<style scoped>
.tabSelected {
  color: white
}

.tabNotSelected {
  color: #de6666
}
</style>