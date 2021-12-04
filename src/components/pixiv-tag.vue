<template>
  <span>
    <el-tooltip content="点击搜索" placement="top">
      <el-tag
          style="cursor:pointer"
          :size="size"
          @click="click"
      >
      {{ data.tag }}
    </el-tag>
    </el-tooltip>
    <span v-if="data.hasOwnProperty('translation') && data.translation.hasOwnProperty('en')" style="color:white">
          <el-tooltip content="点击复制" placement="top">
<click-copy :copy-text="data.translation.en">
          {{ data.translation.en }}
      </click-copy>
    </el-tooltip>
    </span>
  </span>
</template>

<script>
import ClickCopy from "@/components/click-copy";

export default {
  name: "pixiv-tag",
  components: {ClickCopy},
  data() {
    return {}
  },
  methods: {
    click() {
      this.$router.push(`/search/${this.data.tag}/1`)
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    size: {
      type: String,
      default: "small"
    },
    data: {
      type: Object,
      required: true
    }
  },
}

</script>

<style scoped>

</style>