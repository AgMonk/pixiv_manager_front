<template>
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
        <el-col style="text-align: left" :span="18">
          <user-avatar v-if="!disableAvatar"
                       :user="data"
                       avatar-img-key="profileImageUrl"
                       name-key="userName"
                       :avatar-size="24"
                       :name-size="18"
                       :name-length="8"
          />
<!--          <el-avatar :size="24" v-if="!disableAvatar&&data.hasOwnProperty('profileImageUrl')" :src="data.profileImageUrl"/>-->
<!--          <router-link :to="`/user/${data.userId}/illust/1`">-->
<!--            <el-link type="primary"-->
<!--                     v-if="!disableAvatar"-->
<!--                     style="font-size: 18px;color:white;"-->
<!--            >{{ data.userName.substring(0, Math.min(6, data.userName.length)) }}-->
<!--            </el-link>-->
<!--          </router-link>-->
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
import UserAvatar from "@/components/user-avatar";

export default {
  name: "illust-card",
  components: {UserAvatar, BookmarkIcon},
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
    },
    disableAvatar:{
      type: Boolean
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