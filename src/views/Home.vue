<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import methods from "methods";
import {mapActions} from "vuex";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods:{
    ...mapActions('pixivIllust',[`getDetail`]),
    ...mapActions('pixivFollow',[`getFollow`]),
  },
  mounted() {
    this.getDetail(94286060)
    this.getFollow(1);
  }
}
</script>
