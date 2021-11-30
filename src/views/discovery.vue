<template>
  <el-container direction="vertical">
    <el-header>
      <el-button size="mini" type="primary" @click="list=[];data=[];load(30)">刷新</el-button>
      <el-button size="mini" type="primary" @click="scroll">加载</el-button>
    </el-header>
    <el-main>
      <el-scrollbar style="height: 100%">
        <div v-infinite-scroll="scroll"
             :infinite-scroll-delay="500"
             :infinite-scroll-distance="50"
             style="height:700px"
        >
          <el-row>
            <el-col v-for="item in list" :lg="4" :md="6" :sm="8" :xl="3"
                    :xs="12">
              <illust-card :data="item"
                           @bookmark-add-success="load(12,$event)"
                           @bookmark-del-success="$emit('bookmark-del-success',$event)"
              />
            </el-col>
          </el-row>
          <el-row style="color:white">
            <el-col>加载中...</el-col>
          </el-row>
        </div>
      </el-scrollbar>

    </el-main>

  </el-container>
</template>

<script>
import {mapActions, mapState} from "vuex";
import IllustCard from "@/components/illust-card";
import {addDomains} from "@/assets/js/pixivUtils";
import {setTitle} from "@/assets/js/projectUtils";

export default {
  name: "discovery",
  components: {IllustCard},
  data() {
    return {
      size: 12,
      //显示的数据
      list: [],
      //已拿到的数据
      data: [],
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivDiscovery", [`discovery`]),
    load(limit, sampleIllustId) {
      return this.discovery({limit, sampleIllustId}).then(res => {
        const domain = this.config.imgDomain;
        addDomains(res, domain)

        const idList = this.list.map(i => i.id);
        const idList2 = this.data.map(i => i.id);
        res = res.filter(i => {
          return !idList.includes(i.id) && !idList2.includes(i.id)
        })

        this.data.push(...res)
        console.log(`缓存已添加 当前缓存剩余 ${this.data.length}`)
      })
    },
    scroll() {
      if (this.data.length <= this.size) {
        console.log('已滚动到底部,请求新数据...')
        this.load(this.size).then(() => {
          this.list.push(...this.data.splice(0, this.size))
        });
      } else {
        console.log(`加载缓存中的数据 当前缓存剩余 ${this.data.length}`)
        this.list.push(...this.data.splice(0, this.size))
        console.log(this.list)
      }
    },
  },
  mounted() {
    // this.load(20)
    setTitle('发现')
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>