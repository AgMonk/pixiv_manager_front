<template>
  <el-card v-if="data && data.hasOwnProperty('id')" :body-style="{ padding: '0px' }">
    <div>
      <router-link :to="`/artwork/${data.id}`">
        <el-image
          style="width: 184px; height: 184px"
          :src="data.url"
      />
      </router-link>
    </div>
    <div>
      <router-link :to="`/artwork/${data.id}`">
        {{ data.title }}
      </router-link>
    </div>
    <div>
      <el-row>
        <el-col style="text-align: left" :span="18">
          <!--                todo 应该修改为本站地址-->
          <el-avatar :size="24" v-if="data.hasOwnProperty('profileImageUrl')" :src="data.profileImageUrl"/>
          <el-link type="primary"
                   :href="`https://www.pixiv.net/users/${data.userId}/artworks`"
                   target="_blank"
                   style="font-size: 18px;"
          >{{ data.userName.substring(0, Math.min(6, data.userName.length)) }}
          </el-link>
        </el-col>
        <el-col style="text-align: right" :span="6">
          <bookmark-icon :pid="data.id" :token="config.token" :data="data.bookmarkData"/>
          ({{data.pageCount}})
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import BookmarkIcon from "@/components/bookmark-icon";
import {mapState} from "vuex";

export default {
  name: "illust-card",
  components: {BookmarkIcon},
  data() {
    return {}
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    showAvatar: {
      type: Boolean
    },
    data: {
      type: Object,
      required: true,
    }
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