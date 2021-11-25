<template>
  <el-container direction="vertical" v-loading="loading">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h3><el-link style="font-size: 25px" :href="`https://pixiv.net/artworks/${illust.id}`" target="_blank">{{illust.title}}</el-link></h3>
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
            <el-descriptions border :column="1">
              <template #title>
                <el-avatar :size="50" v-if="user && user.hasOwnProperty('image')" :src="config.imgDomain+user.image"/>
                <!--                todo 应该修改为本站地址-->
                <el-link type="primary" :href="`https://www.pixiv.net/users/${illust.userId}`" target="_blank">{{ illust.userName }}</el-link>
              </template>
              <template #extra>
                <follow-button
                    v-if="user && user.hasOwnProperty('isFollowed')"
                    :uid="user.userId"
                    :is-followed="user.isFollowed"
                    @follow-success="followSuccess"
                />
              </template>
              <el-descriptions-item label="作品目录">
                <!--                todo 应该修改为本站地址-->
                <el-link type="primary" :href="`https://www.pixiv.net/users/${illust.userId}/artworks`" target="_blank">作品目录</el-link>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!--作品信息-->
          <div>
            <div>
              <el-descriptions :title="`作品信息 (${illust.pageCount} 张)`" border :column="1">
                <template #extra>
                  <bookmark-icon v-if="illust" :data="illust.bookmarkData"/>
                  <span style="font-size:25px;">{{ illust.bookmarkCount }}</span>
                </template>
                <el-descriptions-item label="pid">{{ illust.id }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ new Date(illust.createDate).format("yyyy-MM-dd hh:mm") }}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{ new Date(illust.uploadDate).format("yyyy-MM-dd hh:mm") }}</el-descriptions-item>
                <el-descriptions-item label="尺寸">{{ illust.width }}x{{ illust.height }}</el-descriptions-item>
                <el-descriptions-item label="喜欢">{{ illust.likeCount }}</el-descriptions-item>
                <el-descriptions-item label="浏览">{{ illust.viewCount }}</el-descriptions-item>
                <el-descriptions-item label="下载原图">
                  <el-collapse>
                    <el-collapse-item title="下载地址(点击展开)" name="1" v-if="illust.urls && illust.urls.hasOwnProperty('original')">
                      <el-link
                          v-for="url in illust.urls.original"
                          :href="url"
                          :download="url.substring(url.lastIndexOf('/')+1)"
                          target="_blank"
                      >
                        {{ url.substring(url.lastIndexOf("/") + 1) }}
                      </el-link>
                    </el-collapse-item>
                  </el-collapse>
                  <el-button type="primary" @click="downloadWithAria2" size="mini">发送到Aria2</el-button>
                </el-descriptions-item>
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
import FollowButton from "@/components/follow-button";
import axios from "axios";

export default {
  name: "artwork",
  components: {FollowButton, BookmarkIcon},
  data() {
    return {
      illust: {},
      user: {},
      loading: false,
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivIllust", [`findDetail`, `getDetail`]),
    ...mapActions("pixivUser", [`findUserInfo`, `getUserInfo`]),
    followSuccess(uid){
      this.getUserInfo(uid).then(res => this.user = copyObj(res))
    },
    downloadWithAria2() {
      let id = new Date().getTime();
      this.illust.urls.original.forEach(url => {
        const original = url.substring(url.indexOf('/img-original'));
        const params = {
          method: 'aria2.addUri',
          id,
          jsonrpc: 2.0,
          params: [
            [
              `https://i.pixiv.re${original}`,
              `https://i.pximg.net${original}`,
            ],
            {
              dir: this.config.aria2.dir,
              fileName: url.substring(url.lastIndexOf('/') + 1),
              referer: "*",
            }
          ],
        }
        axios.post('/aria2', params).then(res => {
          if (res.status === 200) {
            if (res.data.id === id && res.data.result !== undefined && res.data.result.length === 16) {
              this.$message.success('提交下载任务成功')
            }
          }
        })
      })

    },
    handleUrls() {
      Object.keys(this.illust.urls).forEach(key => {
        this.illust.urls[key] = this.illust.urls[key].map(item => this.config.imgDomain + item)
      })
    },
    refresh() {
      this.loading = true;
      this.findDetail(this.$route.params.pid).then(res => {
        this.illust = copyObj(res)
        this.handleUrls()
        this.loading = false;
        this.findUserInfo(this.illust.userId).then(res => this.user = copyObj(res))
      })
    }
  },
  mounted() {
    this.refresh()
    console.log(this.config)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>