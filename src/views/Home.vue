<template>
  <el-container direction="vertical">
    <!--  <el-container direction="horizontal">-->
    <el-header>
    </el-header>

    <el-main>
      <el-form style="width:500px" label-width="100px">
        <el-form-item>
          <!--suppress HtmlUnknownAttribute -->
          <template #label>
            <span class="label">解析地址</span>
          </template>
          <el-input v-model="url" style="width:300px"/>
          <el-button type="primary" @click="parseUrl(url)">解析</el-button>
        </el-form-item>
        <el-form-item>
          <!--suppress HtmlUnknownAttribute -->
          <template #label>
            <span class="label">搜索</span>
          </template>
          <el-input v-model="keyword" style="width:300px"/>
          <el-button type="primary" @click="routeToSearch(keyword)">搜索</el-button>
        </el-form-item>
         <el-form-item>
          <!--suppress HtmlUnknownAttribute -->
          <template #label>
            <span class="label">Pid</span>
          </template>
          <el-input v-model="pid" style="width:300px" type="number"/>
          <el-button type="primary" @click="routeToIllust(pid)">跳转</el-button>
        </el-form-item>
        <el-form-item>
          <!--suppress HtmlUnknownAttribute -->
          <template #label>
            <span class="label">Uid</span>
          </template>
          <el-input v-model="uid" style="width:300px" type="number"/>
          <el-button type="primary" @click="routeToUser(uid)">跳转</el-button>
        </el-form-item>


      </el-form>

    </el-main>
    <el-footer></el-footer>
  </el-container>

</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {mapActions} from "vuex";
import {setTitle} from "@/assets/js/projectUtils";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      url: '',
      pid: undefined,
      uid: undefined,
      keyword:``,
    }
  },
  methods: {
    parseUrl(url) {
      const pattern_artwork = /https:\/\/www\.pixiv\.net\/artworks\/(\d+)/g
      const pattern_user = /https:\/\/www\.pixiv\.net\/users\/(\d+)$/g
      const pattern_user_artwork = /https:\/\/www\.pixiv\.net\/users\/(\d+)\/artworks$/g

      let g1 = pattern_artwork.exec(url);
      if (g1) {
        this.routeToIllust(g1[1])
      }
      let g2 = pattern_user.exec(url);
      if (g2) {
        this.routeToUser(g2[1])
      }
      let g3 = pattern_user_artwork.exec(url);
      if (g3) {
        this.routeToUser(g3[1])
      }

    },
    routeToUser(uid) {
      this.$router.push(`/user/${uid}/illust/1`);
    },
    routeToIllust(pid) {
      this.$router.push(`/artwork/${pid}`);
    },
    routeToSearch(keyword) {
      this.$router.push(`/search/${keyword}/1`);
    },

  },
  mounted() {
    setTitle('首页')


  }
}
</script>
<style scoped>
.label{
  color:white;
}
</style>