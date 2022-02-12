<template>
  <div v-infinite-scroll="loadRoots"
       :infinite-scroll-delay="500"
       :infinite-scroll-disabled="comments.hasNext"
       :infinite-scroll-distance="50"
       style="height:300px"
  >
    <comment-root v-for="item in comments.data" :data="item" />
    <el-row style="color:white">
      <el-col v-if="comments.disabled">没有了</el-col>
      <el-col v-else>加载中...</el-col>
    </el-row>
  </div>
</template>

<script>
import {mapActions} from "vuex";
import CommentRoot from "@/components/comments/CommentRoot";

export default {
  name: "CommentArea",
  components: {CommentRoot},
  data() {
    return {
      comments: {
        data: [],
        disabled: false,
      }
    }
  },
  computed: {},
  methods: {
    ...mapActions("pixivIllustComments", [`roots`]),
    loadRoots() {
      const offset = this.comments.data.length
      this.roots({pid: this.pid, offset}).then(res => {
        const {comments, hasNext} = res
        this.comments.data.push(...comments)
        this.comments.disabled = !hasNext;
        console.log(comments)
      })
    }
  },
  mounted() {
  },
  watch: {},
  props: {pid: {required: true}},
}

</script>

<style scoped>

</style>