<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>标签管理</el-header>

    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "tags",
  data() {
    return {
      params:{
        filter: {
          type: "未完成"
        },
        page: 1,
        size: 10
      },
    }
  },
  methods: {
    ...mapActions("tags",[`page`]),
  },
  mounted() {
    this.page(this.params)
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>