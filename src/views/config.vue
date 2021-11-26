<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
      <el-button type="primary" @click="dialogShow.setCookie=true;">设置Cookie</el-button>
      <el-button type="primary" @click="dialogShow.setToken=true;">设置Token</el-button>
    </el-header>

    <el-main>
      <el-form :model="myConfig">
        <el-form-item label="图片服务器">
          <el-radio-group v-model="myConfig.imgDomain" @change="changeConfig">
            <el-radio-button label="https://i.pixiv.re">pixiv.re</el-radio-button>
            <el-radio-button label="/pximg">pximg.org</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="aria2下载目录" v-if="myConfig.aria2">
          <el-input v-model="myConfig.aria2.dir" @change="changeConfig"/>
        </el-form-item>
      </el-form>


      <el-dialog title="设置Cookie" v-model="dialogShow.setCookie">
        <el-input type="textarea" placeholder="cookie" v-model="cookie"/>
        <el-button type="danger" @click="cookie=``">重置</el-button>
        <el-button type="primary" @click="setCookie();dialogShow.setCookie=false">确认</el-button>
      </el-dialog>
      <el-dialog title="设置Token" v-model="dialogShow.setToken">
        <el-input placeholder="token" v-model="token"/>
        <el-button type="danger" @click="token=``">重置</el-button>
        <el-button type="primary" @click="setToken();dialogShow.setToken=false">确认</el-button>
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
      cookie: "",
      token: "",
      dialogShow: {
        setCookie: false,
        setToken: false,
      },
      myConfig: {},
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
    setCookie() {
      const pattern = /PHPSESSID=(\d+)/g
      const group = pattern.exec(this.cookie)
      this.myConfig.uid = group[1];
      this.changeConfig()
      setCookies(this.cookie, 60, "/pixiv-net")
    },
    setToken() {
      this.myConfig.token = this.token;
      this.changeConfig()
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