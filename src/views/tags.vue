<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-select v-model="params.filter.type" @change="changeType">
        <el-option value="未完成">未完成</el-option>
        <el-option value="已完成">已完成</el-option>
        <el-option value="重定向">重定向</el-option>
      </el-select>
    </el-header>

    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

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
      total:100,
      pageData:[],
      allCompletedTags:[],
    }
  },
  methods: {
    ...mapActions("tags",[`page`,`findAllCompletedTags`]),
    ...mapMutations("tags",[`setParams`]),
    ...mapGetters("tags",[`getParams`]),
    changeType(){
      this.params.page=1;
      this.setParams(this.params);
      this.refresh()
    },
    refresh(){
      this.page().then(res=>{
        if (res.code === 2000) {
          this.pageData = res.data.records;
          this.total = res.data.total;
          console.log(this.pageData )
        }
      })
      this.findAllCompletedTags().then(res=>{
        if (res.code === 2000) {
          this.allCompletedTags = res.data;
          console.log(res.data)
        }
      })
    },
  },
  mounted() {
    this.params = this.getParams()
    this.refresh();
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>