<template>
  <el-button :size="size?size:defaultSize" v-if="isFollowed" type="info" @click="cancelFollow">已关注</el-button>
  <el-button :size="size?size:defaultSize" v-else type="primary" @click="followUser">关注</el-button>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "follow-button",
  data() {
    return {
      defaultSize: "mini"
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivUser", [`getUserInfo`]),
    ...mapActions("bookmark", [`follow`]),
    cancelFollow() {
      console.log(`取消关注 uid = ${this.uid}`)
      /*todo 取消关注请求 */
    },
    followUser() {
      console.log(`关注 uid = ${this.uid}`)
      this.follow({
        uid: this.uid,
        token: this.config.token,
      }).then(() => {
        this.$message.success("关注成功")
        this.$emit("follow-success", this.uid)
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
    }
  },
}

</script>

<style scoped>

</style>