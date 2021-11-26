<template>
  <my-navigation />

  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: black;
  /*background-color: #e1efeb;*/
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
<script>
import MyNavigationItem from "@/components/my/my-navigation-item";
import MyNavigation from "@/components/my/my-navigation";
import {mapMutations} from "vuex";
export default {
  components: {MyNavigation, MyNavigationItem},

  methods:{
    ...mapMutations(`config`,[`loadConfig`])
  },
  mounted(){
    this.loadConfig();
  }
}
</script>