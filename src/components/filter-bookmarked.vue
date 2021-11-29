<template>
 <span style="margin-left: 25px">
   <span style="color:white">过滤已收藏:</span>
      <el-switch
          v-model="filterBookmarked"
          @change="switchFilterBookmarked"
          style="margin-left: 24px"
          inline-prompt
          active-icon="是"
          inactive-icon="否"
      />
 </span>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "filter-bookmarked",
  data() {
    return {
      filterBookmarked:false,

    }
  },
  computed: {
    ...mapState(`config`, [`config`])
  },
  methods: {
    ...mapMutations(`config`, [`setConfig`]),
    switchFilterBookmarked(e) {
      this.setConfig({key: 'filterBookmarked', value: e})
      this.$emit('change',e);
    },
  },
  mounted() {
    this.filterBookmarked = this.config.filterBookmarked;
  },
  watch: {},
  props: {},
}

</script>

<style scoped>

</style>