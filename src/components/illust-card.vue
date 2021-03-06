<template>
  <el-tooltip
      :disabled="disableTooltip"
      class="item"
      effect="light"
      placement="bottom"
      :show-after="100"
  >
    <!--suppress HtmlUnknownAttribute -->
    <template #content>
      <!--      鼠标提示内容 -->
      <el-descriptions label="作品简介" border :column="1">
        <el-descriptions-item label="pid">{{ data.id }}
          <el-button size="mini" type="primary">
            <click-copy :copy-text="data.id">复制</click-copy>
          </el-button>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ new Date(data.createDate).format("yyyy-MM-dd hh:mm") }}</el-descriptions-item>
        <el-descriptions-item label="标签">
          <template v-for="item in data.tagTranslation">
            <el-tag>{{ item.key }}{{ item.value ? ` / ${item.value}` : '' }}</el-tag>
            <br>
          </template>
        </el-descriptions-item>

      </el-descriptions>
    </template>
    <el-card v-if="data && data.hasOwnProperty('id')" :body-style="{ padding: '0px','background-color':`#1f1f1f` }">
      <div>
        <router-link :to="`/artwork/${data.id}`">
          <el-image
              style="width: 184px; height: 184px"
              :src="data.url"
              lazy
          />
        </router-link>
      </div>
      <div>
        <router-link :to="`/artwork/${data.id}`">
          <span style="color:white;font-size: 11px"> {{ data.title }}</span>
        </router-link>
      </div>
      <div>
        <el-row>
          <el-col :span="14" style="text-align: left">
            <user-avatar v-if="!disableAvatar"
                         :user="data"
                         avatar-img-key="profileImageUrl"
                         name-key="userName"
                         :avatar-size="24"
                         :name-size="18"
                         :name-length="8"
            />
          </el-col>
          <el-col :span="10" style="text-align: right;color:white">
            <el-tooltip content="在新标签打开" placement="top">
              <el-icon :size="30" style="cursor: pointer" @click="clickPlus(data.id)">
                <plus/>
              </el-icon>
            </el-tooltip>
            <bookmark-icon :pid="data.id" :token="config.token" :data="data.bookmarkData"
                           @bookmark-add-success="bookmarkStatusChanged('bookmark-add-success',$event)"
                           @bookmark-del-success="bookmarkStatusChanged('bookmark-del-success',$event)"
            />
            ({{ data.pageCount }})
          </el-col>
        </el-row>
      </div>
    </el-card>
  </el-tooltip>

</template>

<script>
import BookmarkIcon from "@/components/bookmark-icon";
import {mapGetters, mapState} from "vuex";
import UserAvatar from "@/components/user-avatar";
import ClickCopy from "@/components/click-copy";

export default {
  name: "illust-card",
  components: {ClickCopy, UserAvatar, BookmarkIcon},
  data() {
    return {}
  },
  emits: ['bookmark-add-success', 'bookmark-del-success'],
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapGetters('pixivTagTranslation', [`getAllTranslations`]),
    bookmarkStatusChanged(name, e) {
      this.$emit(name, e)
    },
    clickPlus(id) {
      window.open(`/artwork/${id}`)
    }
  },
  mounted() {
    //尝试翻译标签
    const translation = this.getAllTranslations();
    this.data.tagTranslation = this.data.tags.map(t => {
      return {key: t, value: translation[t]}
    })
  },
  watch: {},
  props: {
    showAvatar: {
      type: Boolean
    },
    data: {
      type: Object,
      required: true,
    },
    disableAvatar: {
      type: Boolean
    },
    disableTooltip: {
      type: Boolean,
      default: true,
    },
  },
}

</script>

<style scoped>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>