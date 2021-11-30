<template>
  <el-scrollbar style="height: 100%">
    <div v-infinite-scroll="load"
         :infinite-scroll-disabled="list.length===data.length"
         :infinite-scroll-distance="50"
         :infinite-scroll-delay="500"
         style="height:600px"
    >
      <el-row>
        <el-col v-for="item in list" :lg="4" :md="6" :sm="8" :xl="3"
                :xs="12">
          <illust-card :data="item"
                       @bookmark-add-success="$emit('bookmark-add-success',$event)"
                       @bookmark-del-success="$emit('bookmark-del-success',$event)"
          />
        </el-col>
      </el-row>
      <el-row style="color:white">
        <el-col v-if="list.length===data.length">没有了</el-col>
        <el-col v-else>加载中...</el-col>
      </el-row>
      <el-backtop/>
    </div>
  </el-scrollbar>
</template>

<script>
import IllustCard from "@/components/illust-card";

export default {
  name: "illust-cards",
  components: {IllustCard},
  data() {
    return {
      offset: 0,
      limit: 6,
      list: [],
      infiniteScroll: false
    }
  },
  emits: ['bookmark-add-success', 'bookmark-del-success'],
  methods: {
    load() {
      if (this.offset < this.data.length) {
        console.log(`加载数据 ${this.offset}`)
        this.list.push(...this.data.slice(this.offset, this.offset + this.limit))
        this.offset += this.limit;
      }
    },
  },
  mounted() {
  },
  watch: {},
  props: {
    data: {
      type: Object,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>