<template>
    <el-icon :size="size?size:defaultSize">
      <alarm-clock v-if="loading"/>
      <star-filled class="clickAble" v-else-if="bookmarkData &&bookmarkData.hasOwnProperty('id')" @click="click"/>
      <star class="clickAble" v-else @click="click"/>
    </el-icon>
</template>

<script>
import {copyObj} from "@/assets/js/utils";

export default {
  name: "bookmark-icon",
  data() {
    return {
      bookmarked: true,
      defaultSize: 30,
      loading: false,
      bookmarkData: {},
    }
  },
  methods: {
    click() {
      if (this.loading) {
        return;
      }
      /*todo 发送请求 收藏作品 或 取消收藏 */
      console.log(1)
      this.loading = true;
      setTimeout(() => {
        this.loading = false;

      }, 3000);
    },
  },
  mounted() {
    this.bookmarkData = this.data ? copyObj(this.data) : {}
  },
  watch: {},
  props: {
    "size": {type: Number},
    "data": {type: Object},
  },
}

</script>

<style scoped>
.clickAble {
  cursor: pointer
}
</style>