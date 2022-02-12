<template>
  <div style="text-align: left">
    <user-avatar :avatar-size="40" :name-size="18" :user="data" avatarImgKey="img" nameKey="userName" />
    <span class="comment-text"> @ {{ data.commentDate }}</span>
    <div class="comment-text" style="margin-left: 50px">
      <div>{{ data.comment }}</div>
      <el-button v-if="data.hasReplies" size="mini" type="info">查看回复</el-button>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/user-avatar";

export default {
  name: "CommentRoot",
  components: {UserAvatar},
  data() {
    return {}
  },
  computed: {},
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {required: true}
  },
}

</script>

<style scoped>
.comment-text {
  color: rgba(255, 255, 255, 0.39)
}
</style>