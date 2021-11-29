<template>
  <el-row>
    <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3"
            v-for="item in data">
      <illust-card :data="item"
                   @bookmark-add-success="$emit('bookmark-add-success',$event)"
                   @bookmark-del-success="$emit('bookmark-del-success',$event)"
      />
    </el-col>
  </el-row>
</template>

<script>
import IllustCard from "@/components/illust-card";
export default {
  name: "illust-cards",
  components: {IllustCard},
  data() {
    return {}
  },
  emits: ['bookmark-add-success', 'bookmark-del-success'],
  methods: {},
  mounted() {
  },
  watch: {},
  props: {
    data: {
      type:Object,
      required: true,
    }
  },
}

</script>

<style scoped>

</style>