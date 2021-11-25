<template>
<!--  todo 点击搜索标签 -->
  <span>
    <el-tag
        style="cursor:pointer"
        :size="size?size:defaultSize"
    >
      {{ data.tag }}
    </el-tag>
    {{!data.translation?"":data.translation.en}}
  </span>
</template>

<script>
export default {
  name: "pixiv-tag",
  data() {
    return {
      defaultSize:"small",
    }
  },
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    size:{type:String},
    data:{
      type:Object,
      required: true
    }
  },
}

</script>

<style scoped>

</style>