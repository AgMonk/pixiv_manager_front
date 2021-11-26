<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import {mapActions} from "vuex";
import {getCookieMap} from "@/assets/js/cookieUtils";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods:{
    ...mapActions('pixivUserIllust',[`findProfileAll`,`findProfileIllusts`])
  },
  mounted() {
    console.log(getCookieMap())
  }
}
</script>
