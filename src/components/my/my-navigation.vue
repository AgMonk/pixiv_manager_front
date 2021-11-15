
<template>
  <el-menu
      :default-active.sync="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      @select="select"
      router
      active-text-color="#ffd04b">
  <my-navigation-item v-for="(route,i) in routes.filter(i=>i.hasOwnProperty(`name`))" :key="i" :route="route" parent-path=""/>
  </el-menu>
</template>

<script>
import {routes} from "@/router";
import MyNavigationItem from "@/components/my/my-navigation-item";
import {mapState} from "vuex";

export default {
  name: "my-navigation",
  components: {MyNavigationItem},
  data() {
    return {
      routes,
      activeIndex:location.pathname,
    }
  },
  computed: {
  },
  methods: {
    select(index,indexPath){
     // if(!this.user){
     //   this.activeIndex = "/me"
     // }
    }
  },
  mounted() {
  },
}

</script>

<style scoped>

</style>