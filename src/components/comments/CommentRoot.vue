<template>
  <div style="text-align: left">
    <user-avatar :avatar-size="40" :name-size="18" :user="data" avatarImgKey="img" nameKey="userName" />
    <span class="comment-text"> @ {{ data.commentDate }}</span>
    <div class="comment-text" style="margin-left: 50px">
      <div>{{ data.comment }}</div>
      <el-button v-if="data.hasReplies &&replyData.hasNext " size="mini" type="info" @click="loadReplies">查看回复</el-button>
      <!--      回复 -->
      <div v-if="replyData.data && replyData.data.length>0">
        <div v-for="item in replyData.data">
          <user-avatar :avatar-size="40" :name-size="18" :user="item" avatarImgKey="img" nameKey="userName" />
          <span class="comment-text"> @ {{ item.commentDate }}</span>
          <div class="comment-text" style="margin-left: 50px">
            <div>{{ item.comment }}</div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from "@/components/user-avatar";
import {mapActions} from "vuex";

export default {
  name: "CommentRoot",
  components: {UserAvatar},
  data() {
    return {
      replyData: {
        data: [],
        hasNext: true,
      },
      page: 0,
    }
  },
  computed: {},
  methods: {
    ...mapActions("pixivIllustComments", [`replies`]),
    loadReplies() {
      if (!this.replyData.hasNext) {
        return;
      }
      this.page++;
      this.replyData.hasNext = false;
      this.replies({id: this.data.id, page: this.page}).then(res => {
        this.replyData.data.push(...res.comments)
        this.replyData.hasNext = res.hasNext;
      })
    },
  },
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