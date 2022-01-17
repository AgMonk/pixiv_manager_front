<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-select v-model="params.filter.type" @change="changeType">
        <el-option value="未完成">未完成</el-option>
        <el-option value="已完成">已完成</el-option>
        <el-option value="重定向">重定向</el-option>
      </el-select>
      <el-select v-model="params.filter.dirName" clearable placeholder="目录" @change="changeType">
        <el-option v-for="item in dirs" :value="item">{{ item }}</el-option>
      </el-select>
      <el-pagination
          @current-change="refresh"
          v-model:currentPage="params.page"
          :page-size="params.size"
          layout="total, prev, pager, next, jumper"
          :total="total"
      >
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
                                 @change="findType"
                                 @select="findType"
                />
              </el-form-item>
              <el-form-item label="标签类型">
                <el-select v-model="formData.type" placeholder="" filterable >
                  <el-option v-for="item in tagTypes" :label="item" :value="item"/>
                </el-select>
                <el-button type="primary" style="margin-left: 10px" @click="setTranslation(props.row.tag,formData)">提交</el-button>
                <el-button style="margin-left: 10px" type="primary" @click="setTranslation(props.row.tag,{translation:props.row.tag,type:'其他'})">空过</el-button>
              </el-form-item>
            </el-form>
            <div v-if="props.row.suggest && props.row.suggest.length>0">
              翻译建议：
              <el-tag v-for="item in props.row.suggest" class="clickableTag" @click="formData.translation=item;findType()">{{ item }}</el-tag>
            </div>
            <div v-if="props.row.suggestRedirect && props.row.suggestRedirect.length>0">
              重定向建议
              <el-tag type="warning" v-for="item in props.row.suggestRedirect" class="clickableTag"
                      @click="formData.translation=item.customTranslation;findType()">{{ item.customTranslation }}</el-tag>
            </div>
            <div v-if="props.row.examples && props.row.examples.length>0">
              <image-preview :src-list="props.row.examples"/>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="tag" label="原标签名" width="300px"/>
        <el-table-column prop="originalTranslation" label="原翻译" width="300px"/>
        <el-table-column prop="customTranslation" v-if="params.filter.type==='已完成'" label="自定义翻译" width="300px"/>
        <el-table-column prop="redirect" v-if="params.filter.type==='重定向'" label="重定向" width="300px"/>
        <el-table-column prop="type" label="标签类型"  v-if="params.filter.type==='已完成'" width="100px"/>
        <el-table-column label="使用次数" prop="count" width="100px"/>
        <el-table-column  label="操作" >
          <!--suppress HtmlUnknownAttribute -->
          <template #default="props">
            <el-link class="operationLink" target="_blank" :href="`https://fanyi.baidu.com/#${getLanguage(props.row.tag)}/zh/${props.row.tag}`">百度翻译</el-link>
            <el-link class="operationLink" target="_blank" :href="`https://www.baidu.com/s?wd=${props.row.tag}`">百度搜索</el-link>
            <el-link class="operationLink" target="_blank" :href="`https://dic.pixiv.net/a/${props.row.tag}`">Pixiv字典</el-link>
            <el-link class="operationLink" target="_blank" :href="`https://www.pixiv.net/tags/${props.row.tag}/artworks?s_mode=s_tag`">Pixiv搜索</el-link>
            <el-link :href="`https://zh.moegirl.org.cn/index.php?search=${props.row.tag}&title=Special%3A%E6%90%9C%E7%B4%A2&profile=default&fulltext=1`"
                     class="operationLink"
                     target="_blank">萌娘百科
            </el-link>
          </template>
        </el-table-column>
      </el-table>

    </el-main>

  </el-container>

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import ImagePreview from "@/components/my/image-preview";
import {setTitle} from "@/assets/js/projectUtils";

export default {
  name: "tags",
  components: {ImagePreview},
  data() {
    return {
      params: {
        filter: {
          type: "未完成",
          dirName: '',
        },
        page: 1,
        size: 10
      },
      formData: {
        translation: "",
        type: "",
      },
      total: 100,
      pageData: [],
      allCompletedTags: [],
      expandRowKeys: [],
      dirs: [],
    }
  },
  computed: {
    ...mapState("tags", [`tagTypes`]),
  },
  methods: {
    ...mapActions("tags", [`page`, `findAllCompletedTags`, `findAllTypes`, `setCustomTranslation`]),
    ...mapMutations("tags", [`setParams`]),
    ...mapGetters("tags", [`getParams`]),
    ...mapActions('pixivFiles', [`listDirs`]),
    getLanguage(s) {
      let code = s.charCodeAt(0);
      let language = 'jp'
      if (code >= 44032 && code <= 55215) {
        language = 'kor'
      }
      if (code >= 65 && code <= 90) {
        language = 'en'
      }
      if (code >= 97 && code <= 122) {
        language = 'en'
      }
      return language;
    },
    findType() {
      const pattern = /^(.+)[(（](.+)[)）]$/g
      const skinPattern = /^(.+)<(.+)>$/g
      const filter = this.allCompletedTags.filter(i => i.customTranslation === this.formData.translation);
      if (filter.length === 1) {
        this.formData.type = filter[0].type;
      }else if (pattern.exec(this.formData.translation)){
        this.formData.type = "人物+作品";
      }else if (skinPattern.exec(this.formData.translation)){
        this.formData.type = "皮肤";
      }
    },
    getRowKey(row) {
      return row.tag
    },
    expandChange(row, rows) {
      if (rows.length === 0) {
        return;
      }
      this.formData = {}
      this.expandRowKeys = []
      this.expandRowKeys.push(this.getRowKey(row))
    },
    setTranslation(tag, formData) {
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
        this.pageData = res.records;
        this.total = res.total;


        this.formData = {type: '其他'}
        this.expandRowKeys = []
        this.expandRowKeys.push(this.getRowKey(this.pageData[0]))
      })
      this.findAllCompletedTags().then(res => {
        if (res.code === 2000) {
          this.allCompletedTags = res.data;
        }
      })

      this.listDirs().then(res => {
        this.dirs = res;
      })

    },
  },
  mounted() {
    setTitle("标签管理")
    this.params = this.getParams()
    this.refresh();
    this.findAllTypes();
  },
  watch: {},
  props: {},
}

</script>

<style scoped>
.clickableTag {
  cursor: pointer;
}
.operationLink{
  margin-left: 5px;
}
</style>