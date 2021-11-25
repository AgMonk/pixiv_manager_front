<template>
  <el-icon :size="size?size:defaultSize">
    <alarm-clock v-if="loading"/>
    <star-filled class="clickAble" v-else-if="bookmarkData &&bookmarkData.hasOwnProperty('id')" @click="click"/>
    <star class="clickAble" v-else @click="click"/>
  </el-icon>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {mapActions} from "vuex";

export default {
  name: "bookmark-icon",
  data() {
    return {
      defaultSize: 30,
      loading: false,
      bookmarkData: {},
    }
  },
  methods: {
    ...mapActions("pixivBookmark", [`bookmarkAdd`, `bookmarkDel`]),
    click() {
      /*todo 发送请求 收藏作品 或 取消收藏 */
      this.loading = true;
      //取消收藏
      if (this.bookmarkData && this.bookmarkData.id) {
        this.bookmarkDel({
          bookmarkId: this.bookmarkData.id,
          token: this.token
        }).then(res => {
          console.log(res)
          this.$emit("bookmark-del-success")
          this.$message.success(`取消收藏成功 pid = ${this.pid}`)
          this.loading = false;
          this.bookmarkData = {}
        }).catch(res=>{
          this.$message.warn("请求超时请重试")
          this.loading = false;
        })
      } else {
        //添加收藏
        this.bookmarkAdd({
          pid: this.pid,
          token: this.token
        }).then(res => {
          this.$emit("bookmark-add-success")
          this.$message.success(`收藏成功 pid = ${this.pid}`)
          this.loading = false;
          this.bookmarkData = {id:res.last_bookmark_id}
        }).catch(res=>{
          this.$message.warn("请求超时请重试")
          this.loading = false;
        })
      }
    },
  },
  mounted() {
    this.bookmarkData = this.data?copyObj(this.data):{}
  },
  watch: {
    "data": {
      handler: function (e) {
        this.bookmarkData = e ? copyObj(e) : {}
      }
    }
  },
  props: {
    "size": {type: Number},
    "data": {type: Object},
    token: {
      required: true,
      type: String,
    },
    pid: {
      required: true,
      type: String,
    },

  },
}

</script>

<style scoped>
.clickAble {
  cursor: pointer
}
</style>