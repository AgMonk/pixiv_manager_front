<template>
 <el-button :size="size?size:defaultSize" v-if="isFollowed" type="info" @click="cancelFollow">已关注</el-button>
 <el-button :size="size?size:defaultSize" v-else type="primary" @click="follow">关注</el-button>
</template>

<script>
export default {
  name: "follow-button",
  data() {
    return {
      defaultSize:"medium"
    }
  },
  methods: {
    cancelFollow(){
      console.log(`取消关注 uid = ${this.uid}`)
      /*todo 取消关注请求 */
    },
    follow(){
      console.log(`关注 uid = ${this.uid}`)
      /*todo 关注请求 */
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    uid:{
      required: true
    },
    isFollowed:{
      required: true,
      type:Boolean,
    },
    size:{
      type:String,
    }
  },
}

</script>

<style scoped>

</style>