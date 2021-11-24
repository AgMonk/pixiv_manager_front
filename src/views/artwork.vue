<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <h3>{{ illust.title }}</h3>
    </el-header>

    <el-main>
      <div v-if="illust.pageCount>1">
        <el-image
            v-for="i in Math.min(illust.pageCount,5)"
            style="width: 100px; height: 100px"
            :src="illust.urls.small[i-1]"
            :preview-src-list="illust.urls['original']"
            :initial-index="i-1"
            hide-on-click-modal
        />
      </div>

      <el-image v-if="illust.urls"
                :src="illust.urls.regular[0]"
                :preview-src-list="illust.urls['original']"
                hide-on-click-modal
      />

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapActions, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "artwork",
  data() {
    return {
      illust: {},
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapActions("pixivIllust", [`findDetail`, `getDetail`]),
    handleUrls(){
      Object.keys(this.illust.urls).forEach(key=>{
        this.illust.urls[key] = this.illust.urls[key].map(item=>this.config.imgDomain+item)
      })
    },
  },
  mounted() {
    this.getDetail(this.$route.params.pid).then(res => {
      this.illust = copyObj(res)
      this.handleUrls()
    })
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>