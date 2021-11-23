<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="dialogShow.setCookie=true;" >设置Cookie</el-button>
      <el-button type="primary" @click="" >设置Token</el-button>
    </el-header>

    <el-main>
      <el-form :model="myConfig">
        <el-form-item label="图片服务器">
          <el-radio-group v-model="myConfig.imgDomain" @change="changeConfig">
            <el-radio-button label="https://i.pixiv.re">pixiv.re</el-radio-button>
            <el-radio-button label="/pximg">pximg.org</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>




      <el-dialog title="设置Cookie" v-model="dialogShow.setCookie">
        <el-input type="textarea" placeholder="placeholder" v-model="cookie" />
        <el-button type="danger" @click="cookie=``" >重置</el-button>
        <el-button type="primary" @click="setCookie">确认</el-button>
      </el-dialog>


    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
import {mapMutations, mapState} from "vuex";
import {copyObj} from "@/assets/js/utils";
import {setCookies} from "@/assets/js/cookieUtils";

export default {
  name: "config",
  data() {
    return {
      cookie:"",
      dialogShow:{
        setCookie:false,
        setToken:false,
      },
      myConfig: {
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
    setCookie(){
      setCookies(this.cookie,60,"/pixiv-net")
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