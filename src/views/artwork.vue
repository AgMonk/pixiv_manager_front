<template>
  <el-container v-loading="loading" direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-main>
      <el-container>
        <el-main>
          <!--图片-->

          <div v-if="illust.pageCount>1">
            <el-image
                v-for="i in Math.min(illust.pageCount,5)"
                :initial-index="i-1"
                :preview-src-list="illust.urls['original']"
                :src="illust.urls.small[i-1]"
                hide-on-click-modal
                style="width: 100px; height: 100px"
            />
          </div>
          <el-image v-if="illust.urls"
                    :preview-src-list="illust.urls['original']"
                    :src="illust.urls.regular[0]"
                    hide-on-click-modal
          />
          <!--          标题-->
          <div style="text-align: left;margin-top: 5px">
            <el-link :href="`https://pixiv.net/artworks/${illust.id}`" style="font-size: 25px;" target="_blank">{{ illust.title }}</el-link>
          </div>
          <!--          描述-->
          <div style="text-align: left;margin-top: 5px;color:white" v-html="illust.illustComment">
          </div>
          <!--          标签-->
          <div v-if="illust.tags && illust.tags.tags" style="text-align: left;margin-top: 15px">
            <pixiv-tag v-for="item in illust.tags.tags" :data="item" style="margin-left: 5px" />
          </div>
          <!--          评论区-->
          <div>
            <el-divider content-position="left">评论区</el-divider>
            <comment-area v-if="illust.id" :pid="illust.id" />
          </div>
        </el-main>
        <el-aside>
          <!--作者信息-->
          <div>
            <el-descriptions :column="1" border>
              <template #title>
                <user-avatar :user="user" />
              </template>
              <template #extra>
              </template>
              <el-descriptions-item label="作品目录">
                <router-link :to="`/user/${illust.userId}/illust/1`">
                  <el-link type="primary">作品目录</el-link>
                </router-link>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!--作品信息-->
          <div>
            <div>
              <el-descriptions :column="1" border>
                <template #title>
                  <span style="color:white">作品信息 共：{{ illust.pageCount }} 张</span>
                </template>
                <template #extra>
                  <div>
                    <bookmark-icon
                        v-if="illust && illust.id"
                        :data="illust.bookmarkData"
                        :pid="illust.id"
                    />
                    <span style="font-size:25px;color:white">{{ illust.bookmarkCount }}</span></div>
                </template>
                <el-descriptions-item label="pid">{{ illust.id }}
                  <el-button size="mini" type="primary">
                    <click-copy :copy-text="illust.id">复制</click-copy>
                  </el-button>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ new Date(illust.createDate).format("yyyy-MM-dd hh:mm") }}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{ new Date(illust.uploadDate).format("yyyy-MM-dd hh:mm") }}</el-descriptions-item>
                <el-descriptions-item label="尺寸">{{ illust.width }}x{{ illust.height }}</el-descriptions-item>
                <el-descriptions-item label="喜欢">{{ illust.likeCount }}</el-descriptions-item>
                <el-descriptions-item label="浏览">{{ illust.viewCount }}</el-descriptions-item>
                <el-descriptions-item label="下载原图">
                  <el-collapse>
                    <el-collapse-item v-if="illust.urls && illust.urls.hasOwnProperty('original')" name="1" title="下载地址(点击展开)">
                      <el-link
                          v-for="url in illust.urls.original"
                          :download="url.substring(url.lastIndexOf('/')+1)"
                          :href="url"
                          target="_blank"
                      >
                        {{ url.substring(url.lastIndexOf("/") + 1) }}
                      </el-link>
                    </el-collapse-item>
                  </el-collapse>
                  <el-button size="mini" type="primary" @click="downloadWithAria2">发送到Aria2</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="强制刷新">
                  <el-button size="mini" type="primary" @click="refresh(true)">刷新</el-button>
                </el-descriptions-item>
                <el-descriptions-item label="上传时间">{{}}</el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-aside>
      </el-container>
    </el-main>

  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";
import BookmarkIcon from "@/components/bookmark-icon";
import FollowButton from "@/components/follow-button";
import axios from "axios";
import PixivTag from "@/components/pixiv-tag";
import UserAvatar from "@/components/user-avatar";
import {setTitle} from "@/assets/js/projectUtils";
import ClickCopy from "@/components/click-copy";
import {ElMessage} from "element-plus";
import CommentArea from "@/components/comments/CommentArea";

const getAria2Param = (i, url, dir) => {
  const u = url.substring(url.indexOf("/img"));
  return {
    method: 'aria2.addUri',
    id: `${new Date().getTime()}-${i}`,
    jsonrpc: 2.0,
    params: [
      [
        `https://i.pixiv.re${u}`,
        `https://i.pximg.net${u}`,
      ],
      {
        dir,
        fileName: u.substring(u.lastIndexOf('/') + 1),
        referer: "*",
      }
    ],
  }
}

export default {
  name: "artwork",
  components: {CommentArea, ClickCopy, UserAvatar, PixivTag, FollowButton, BookmarkIcon},
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
    ...mapActions("pixivIllust", [`findDetail`]),
    ...mapActions("pixivUser", [`findUserInfo`, `getUserInfo`]),
    downloadWithAria2() {
      ElMessage.info("开始添加下载任务")
      const array = this.illust.illustType === 2 ? this.illust.urls.zip : this.illust.urls.original;
      for (let i = 0; i < array.length; i++) {
        const aria2Param = getAria2Param(i, array[i], this.config.aria2.dir);
        setTimeout(() => {
          axios.post('/aria2', aria2Param).then(res => {
            if (res.status === 200) {
              if (res.data.id === aria2Param.id && res.data.result !== undefined && res.data.result.length === 16) {
                ElMessage.success(`提交下载任务成功 ${this.illust.id}_${i}`)
              }
            }
          });
        }, i * 500)
      }
    },
    handleUrls() {
      Object.keys(this.illust.urls).forEach(key => {
        this.illust.urls[key] = this.illust.urls[key].map(item => this.config.imgDomain + item)
      })
    },
    refresh(force) {
      this.loading = true;
      this.findDetail({force, pid: this.$route.params.pid}).then(res => {
        if (force) {
          this.$message.success("刷新成功")
        }
        this.illust = copyObj(res)
        this.handleUrls()
        this.loading = false;
        this.findUserInfo({force, uid: this.illust.userId}).then(res => this.user = copyObj(res))

        setTitle(`${this.illust.title} - ${this.illust.userName}`)


      }).catch(reason => {
        this.loading = false;
        console.log(reason)
        ElMessage.error(reason);
      })
    },
  },
  mounted() {
    this.refresh(false)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>