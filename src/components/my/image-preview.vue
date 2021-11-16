<template>
<div>
  <el-image
      style="width: 100px; height: 100px"
      v-for="item in srcList"
      :src="item"
      hide-on-click-modal
      :preview-src-list="srcList"
  >
  </el-image>
</div>
</template>

<script>
export default {
  name: "image-preview",
  data() {
    return {}
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    srcList: {
      required: true,
      type: Array,
    }
  },
}

</script>

<style scoped>

</style>