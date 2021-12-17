<template>
  <el-scrollbar style="height: 100%">
    <div style="color:white">时间跨度: {{ timeRange }}</div>
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
                       :disableTooltip="disableTooltip"
                       :disableAvatar="$route.path.startsWith('/user')"
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
import {copyObj} from "@/assets/js/utils";

export default {
  name: "illust-cards",
  components: {IllustCard},
  data() {
    return {
      offset: 0,
      limit: 6,
      list: [],
      infiniteScroll: false,
      timeRange: '',
      disableTooltip: true,
    }
  },
  emits: ['bookmark-add-success', 'bookmark-del-success'],
  methods: {
    load() {
      if (this.offset < this.data.length) {
        // console.log(`加载数据 ${this.offset}`)
        this.list.push(...this.data.slice(this.offset, this.offset + this.limit))
        this.offset += this.limit;
      }
    },
    //计算时间跨度
    calculationTimeRange(data) {
      const list = copyObj(data)
      list.sort((a, b) => b.id - a.id)
      const first = new Date(list[0].createDate).format("yyyy-MM-dd hh:mm");
      const end = new Date(list[data.length - 1].createDate).format("yyyy-MM-dd hh:mm");
      this.timeRange = `${first} ~ ${end}`
    },
  },
  mounted() {
    console.log(this.data)
    this.calculationTimeRange(this.data)

    document.onkeydown = (e) => {
      if (e.key === "Control") {
        this.disableTooltip = false
        console.log("显示tooltip")
      }
    }
    document.onkeyup = (e) => {
      if (e.key === "Control") {
        this.disableTooltip = true
        console.log("关闭tooltip")
      }
    }
  },
  unmounted() {
    document.onkeydown = undefined
    document.onkeyup = undefined
  },
  watch: {
    // "data": {
    //   handler: function (e) {
    //     console.log(e)
    //     this.offset = 0;
    //     this.list = [];
    //     this.load()
    //     this.calculationTimeRange(e)
    //   }
    // }
  },
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