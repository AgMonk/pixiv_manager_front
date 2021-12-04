<template>
  <span v-clipboard:copy="copyText"
        v-clipboard:error="onError"
        v-clipboard:success="onCopy"
        style="cursor: pointer"
  >
    <slot/>
  </span>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "click-copy",
  data() {
    return {}
  },
  emits: ["copy-fail", "copy-success"],
  methods: {
    onError(e) {
      console.log(e)
      ElMessage.error("复制失败")
      this.$emit("copy-fail", this.copyText)
    },
    onCopy(e) {
      console.log(e)
      ElMessage.success("复制成功")
      this.$emit("copy-success", this.copyText)
    },

  },
  mounted() {
  },
  watch: {},
  props: {
    copyText: {
      type: String,
    }
  },
}

</script>

<style scoped>

</style>