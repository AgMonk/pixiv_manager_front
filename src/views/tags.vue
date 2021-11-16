<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-select v-model="params.filter.type" @change="changeType">
        <el-option value="未完成">未完成</el-option>
        <el-option value="已完成">已完成</el-option>
        <el-option value="重定向">重定向</el-option>
      </el-select>
      <el-pagination
          @current-change="refresh"
          v-model:currentPage="params.page"
          :page-size="params.size"
          layout="total, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-header>

    <el-main>
      <el-table :data="pageData" style="width: 100%" ref="tagTable"
                @expand-change="expandChange"
                :row-key='getRowKey'
                :expand-row-keys="expandRowKeys"
      >
        <el-table-column type="expand">
          <!--suppress HtmlUnknownAttribute -->
          <template #default="props">
            <el-form inline>
              <el-form-item label="设置翻译">
                <el-autocomplete v-model="formData.translation" :fetch-suggestions="querySearch"
                />
              </el-form-item>
              <el-form-item label="标签类型">
                <el-select v-model="formData.type" placeholder="请选择活动区域">
                  <el-option v-for="item in tagTypes" :label="item" :value="item"/>
                </el-select>
                <el-button type="primary" style="margin-left: 10px" @click="setTranslation(props.row.tag,formData)">提交</el-button>
              </el-form-item>
            </el-form>
            <div v-if="props.row.suggest && props.row.suggest.length>0">
              翻译建议：<el-tag v-for="item in props.row.suggest" class="clickableTag" @click="formData">{{item}}</el-tag>
            </div>
            <div v-if="props.row.suggestRedirect && props.row.suggestRedirect.length>0">
              重定向建议
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="tag" label="原标签名"/>
        <el-table-column prop="originalTranslation" label="原翻译"/>
        <el-table-column prop="customTranslation" label="自定义翻译"/>
        <el-table-column prop="redirect" v-if="params.filter.type==='重定向'" label="重定向"/>
        <el-table-column prop="type" label="标签类型"/>
      </el-table>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "tags",
  data() {
    return {
      params: {
        filter: {
          type: "未完成"
        },
        page: 1,
        size: 10
      },
      formData:{
        translation:"",
        type:"",
      },
      total: 100,
      pageData: [],
      allCompletedTags: [],
      expandRowKeys: [],
    }
  },
  computed: {
    ...mapState("tags", [`tagTypes`]),
  },
  methods: {
    ...mapActions("tags", [`page`, `findAllCompletedTags`, `findAllTypes`, `setCustomTranslation`]),
    ...mapMutations("tags", [`setParams`]),
    ...mapGetters("tags", [`getParams`]),
    getRowKey(row){
      return row.tag
    },
    expandChange(row,rows){
      if (rows.length === 0) {
        return;
      }
      this.formData = {}
      this.expandRowKeys = []
      this.expandRowKeys.push(this.getRowKey(row))
    },
    setTranslation(tag,formData) {
      const params = Object.assign({}, {tag}, formData);
      this.setCustomTranslation(params).then(() => {
        this.refresh()
      })
    },
    querySearch(s, cb) {
      const data = this.allCompletedTags.filter(i => {
        return i.tag.includes(s)
            || (i.hasOwnProperty("customTranslation") && i.customTranslation.includes(s))
            || (i.hasOwnProperty("originalTranslation") && i.originalTranslation.includes(s))
      }).map(i => {
        return {
          value: i.customTranslation
        }
      });
      cb(data)
    },
    changeType() {
      this.params.page = 1;
      this.refresh()
    },
    refresh() {
      this.setParams(this.params);
      this.page().then(res => {
        if (res.code === 2000) {
          this.pageData = res.data.records;
          this.total = res.data.total;
          this.pageData.forEach(i=>i.formData={tag:"",translation:"",type:""})
          console.log(this.pageData)
        }
      })
      this.findAllCompletedTags().then(res => {
        if (res.code === 2000) {
          this.allCompletedTags = res.data;
          console.log(this.allCompletedTags)
        }
      })
    },
  },
  mounted() {
    this.params = this.getParams()
    this.refresh();
    this.findAllTypes();
  },
  watch: {},
  props: {},
}

</script>

<style scoped>
.clickableTag{
  cursor: pointer;
}
</style>