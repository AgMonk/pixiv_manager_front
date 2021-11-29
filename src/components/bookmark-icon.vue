<template>
  <el-icon :size="size?size:defaultSize" :color="color">
    <alarm-clock v-if="loading"/>
    <star-filled class="clickAble" v-else-if="bookmarkData &&bookmarkData.hasOwnProperty('id')" @click="click"/>
    <star class="clickAble" v-else @click="click"/>
  </el-icon>
</template>

<script>
import {copyObj} from "@/assets/js/utils";
import {mapActions, mapState} from "vuex";

export default {
  name: "bookmark-icon",
  data() {
    return {
      color:'white',
      defaultSize: 30,
      loading: false,
      bookmarkData: {},
    }
  },
  emits: ['bookmark-add-success','bookmark-del-success'],
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivBookmark", [`bookmarkAdd`, `bookmarkDel`]),
    click() {
      this.loading = true;
      //取消收藏
      if (this.bookmarkData && this.bookmarkData.id) {
        this.color ='white'
        this.bookmarkDel({
          bookmarkId: this.bookmarkData.id,
          token: this.config.token
        }).then(res => {
          console.log(res)
          this.$emit("bookmark-del-success",this.pid)
          this.$message.success(`取消收藏成功 pid = ${this.pid}`)
          this.loading = false;
          this.bookmarkData = {}
          this.color ='white'
        }).catch(res=>{
          this.$message.warn("请求超时请重试")
          this.color ='red'
          this.loading = false;
        })
      } else {
        //添加收藏
        this.bookmarkAdd({
          pid: this.pid,
          token: this.config.token
        }).then(res => {
          this.$emit("bookmark-add-success",this.pid)
          this.$message.success(`收藏成功 pid = ${this.pid}`)
          this.loading = false;
          this.bookmarkData = {id:res.last_bookmark_id}
          this.color ='red'
        }).catch(res=>{
          this.$message.err("请求超时请重试")
          this.color ='white'
          this.loading = false;
        })
      }
    },
    updateData(data){
      this.bookmarkData = data?copyObj(data):{}
      if (this.bookmarkData && this.bookmarkData.hasOwnProperty('id')){
        this.color ="red"
      }else{
        this.color ='white'
      }
    },
  },
  mounted() {
    this.updateData(this.data)
  },
  watch: {
    "data": {
      handler: function (e) {
        this.updateData(e)
      }
    }
  },
  props: {
    "size": {type: Number},
    "data": {type: Object},
    pid: {
      required: true,
    },

  },
}

</script>

<style scoped>
.clickAble {
  cursor: pointer
}
</style>