<template>
  <el-container direction="vertical" v-loading="loading">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h3>{{ illust.title }}</h3>
    </el-header>
    <el-main>
      <el-container>
        <el-main>
          <!--图片-->

          <div v-if="illust.pageCount>1">
            <el-image
                v-for="i in Math.min(illust.pageCount,5)"
                style="width: 100px; height: 100px"
                :src="illust.urls.small[i-1]"
                :preview-src-list="illust.urls['original']"
                :initial-index="i-1"
                hide-on-click-modal
            />
          </div>
          <el-image v-if="illust.urls"
                    :src="illust.urls.regular[0]"
                    :preview-src-list="illust.urls['original']"
                    hide-on-click-modal
          />

<!--       todo 描述 标签   -->
        </el-main>
        <el-aside>
          <!--作者信息-->
          <div>

          </div>
          <!--作品信息-->
          <div>
            <div style="font-size:25px;">
              <bookmark-icon v-if="illust" :data="illust.bookmarkData"/>
              {{illust.bookmarkCount}}
            </div>
            <div>
              <el-descriptions :title="`作品信息 (${illust.pageCount} 张)`" border :column="1">
                <el-descriptions-item label="pid">{{illust.id}}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{new Date(illust.createDate).format("yyyy-MM-dd hh:mm")}}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{new Date(illust.uploadDate).format("yyyy-MM-dd hh:mm")}}</el-descriptions-item>
                <el-descriptions-item label="尺寸">{{illust.width}}x{{illust.height}}</el-descriptions-item>
                <el-descriptions-item label="喜欢">{{illust.likeCount}}</el-descriptions-item>
                <el-descriptions-item label="浏览">{{illust.viewCount}}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";
import BookmarkIcon from "@/components/bookmark-icon";

export default {
  name: "artwork",
  components: {BookmarkIcon},
  data() {
    return {
      illust: {},
      loading: false,
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivIllust", [`findDetail`, `getDetail`]),
    handleUrls() {
      Object.keys(this.illust.urls).forEach(key => {
        this.illust.urls[key] = this.illust.urls[key].map(item => this.config.imgDomain + item)
      })
    },
    refresh() {
      this.loading = true;
      this.getDetail(this.$route.params.pid).then(res => {
        this.illust = copyObj(res)
        this.handleUrls()
        this.loading = false;
      })
    }
  },
  mounted() {
    this.refresh()
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>