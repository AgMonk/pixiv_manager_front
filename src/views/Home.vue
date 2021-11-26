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

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods:{
    ...mapActions('pixivUserIllust',[`findProfileAll`,`findProfileIllusts`])
  },
  mounted() {
    const uid = 32544133;
    this.findProfileAll(uid).then(res=>{
      console.log(res)
      this.findProfileIllusts({
        uid,
        work_category:'illust',
        page:8,
        size:48,
      }).then(r=>{
        console.log(r)
      })
    })
  }
}
</script>
