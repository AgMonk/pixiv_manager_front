<template>
  <el-button :disabled="disabled" :size="size" v-if="isFollowed" type="info" @click="cancelFollow">已关注</el-button>
  <el-button :disabled="disabled" :size="size" v-else type="primary" @click="followUser">关注</el-button>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "follow-button",
  data() {
    return {
      disabled:false,
      defaultSize: "mini"
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivUser", [`getUserInfo`]),
    ...mapActions("pixivBookmark", [`follow`, `unfollow`]),
    cancelFollow() {
      this.disabled = true;
      console.log(`取消关注 uid = ${this.uid}`)
      this.unfollow({
        uid: this.uid,
        token: this.config.token,
      }).then(res => {
        if (res.type === 'bookuser' && this.uid ===res.user_id ) {
          this.$message.success("取消关注成功")
          this.$emit("unfollow-success", this.uid)
          this.disabled = false;
        } else {
          console.log(res)
        }
      })
    },
    followUser() {
      this.disabled = true;
      console.log(`关注 uid = ${this.uid}`)
      this.follow({
        uid: this.uid,
        token: this.config.token,
      }).then(() => {
        this.disabled = false;
        this.$emit("follow-success", this.uid)
        this.$message.success("关注成功")
      })
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    uid: {
      required: true
    },
    isFollowed: {
      required: true,
      type: Boolean,
    },
    size: {
      type: String,
      default:"mini",
    }
  },
}

</script>

<style scoped>

</style>