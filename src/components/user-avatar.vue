<template>
 <span v-if="user && user.hasOwnProperty('userId')">
   <!--      用户头像 -->
      <el-avatar
          :size="avatarSize"
          v-if="user.hasOwnProperty(avatarImgKey)"
          :src="user[avatarImgKey]"
      />
      <span>
         <router-link :to="`/user/${user.userId}/illust/1`">
            <el-link type="primary"
                     :style="`color:white;font-size: ${nameSize}px;`"
            >
              {{ user[nameKey].substring(0, Math.min(nameLength, user[nameKey].length)) }}
            </el-link>
          </router-link>
      </span>
   <span v-if="user.hasOwnProperty('isFollowed') && user.userId!==config.uid">
   <!--      关注按钮-->
      <follow-button
          style="margin-left: 20px"
          :size="followButtonSize"
          :uid="user.userId"
          :is-followed="user.isFollowed"
          @follow-success="user.isFollowed = true"
          @unfollow-success="user.isFollowed = false"
      />
      <el-button
          :size="followButtonSize" type="primary">
        <click-copy :copy-text="`https://pixiv.net/users/${user.userId}/artworks`">复制</click-copy>
      </el-button>
     <!--屏蔽按钮-->
      <el-button v-if="!config.blackList || !config.blackList.hasOwnProperty('user') || !config.blackList.user.hasOwnProperty(user.userId)"
                 :size="followButtonSize"
                 type="danger"
                 @click="confirmAddBlackList(user.userId,user[nameKey])"
      >屏蔽TA</el-button>
      <el-button v-else
                 :size="followButtonSize"
                 type="info"
                 @click="delBlackListUser(user.userId)"
      >解除屏蔽</el-button>
   </span>

 </span>
</template>

<script>
import FollowButton from "@/components/follow-button";
import {mapMutations, mapState} from "vuex";
import ClickCopy from "@/components/click-copy";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "user-avatar",
  components: {ClickCopy, FollowButton},
  data() {
    return {
      defaultValue: {}
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`addBlackListUser`, `delBlackListUser`]),
    confirmAddBlackList(id, name) {
      ElMessageBox.confirm(
          `确定要屏蔽用户 ${name}(${id}) 吗？屏蔽后其作品将不会出现在搜索结果中`,
          '确认',
          {
            confirmButtonText: '屏蔽',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(() => {
        this.addBlackListUser({id, name})
        ElMessage.success("已屏蔽")
      }).catch(() => {
        ElMessage.info("已取消")
      })
    }
  },
  mounted() {
  },
  watch: {},
  props: {
    user: {
      type: Object,
      required: true
    },
    avatarSize: {
      type: Number,
      default: 100,
    },
    avatarImgKey: {
      type: String,
      default: 'imageBig',
    },
    nameSize: {
      type: Number,
      default: 35,
    },
    nameKey: {
      type: String,
      default: 'name',
    },
    nameLength: {
      type: Number,
      default: 100
    },
    followButtonSize: {
      type: String,
      default: 'medium',
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