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
   <!--      关注按钮-->
      <follow-button
          v-if="user && user.hasOwnProperty('isFollowed') && user.userId!==config.uid"
          style="margin-left: 20px"
          :size="followButtonSize"
          :uid="user.userId"
          :is-followed="user.isFollowed"
          @follow-success="user.isFollowed = true"
          @unfollow-success="user.isFollowed = false"
      />
   <!--      插画 漫画切换-->

 </span>
</template>

<script>
import FollowButton from "@/components/follow-button";
import {mapState} from "vuex";

export default {
  name: "user-avatar",
  components: {FollowButton},
  data() {
    return {
      defaultValue: {}
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {},
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
    nameKey:{
      type:String,
      default:'name',
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