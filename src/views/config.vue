<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header></el-header>
    <el-form :model="myConfig">
      <el-form-item label="图片服务器">
        <el-radio-group v-model="myConfig.imgDomain" @change="changeConfig">
          <el-radio-button label="https://i.pixiv.re">pixiv.re</el-radio-button>
          <el-radio-button label="/pximg">pximg.org</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <img :src="myConfig.imgDomain+'/img-original/img/2018/04/24/01/51/35/68377968_p0.png'" alt=""/>
    <el-main></el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";

export default {
  name: "config",
  data() {
    return {
      myConfig: {
        // 图片域名
        imgDomain: "/pximg",
      },
    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`updateConfig`]),
    changeConfig() {
      this.updateConfig(this.myConfig);
    },
  },
  mounted() {
    this.myConfig = copyObj(this.config);
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>