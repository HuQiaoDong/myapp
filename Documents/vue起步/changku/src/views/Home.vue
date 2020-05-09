<template>
  <div class="home">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in indexData.banner.list" :key="index" :style='{"background":`url(${item.image})`,"background-size":"100% 100%"}'>
        <!-- <img :src="item.image" alt /> -->
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import types from "@/store/TYPES.js";
export default {
  name: "Home",
  computed: {
    ...mapState(["indexData"])
  },
  methods: {
    ...mapActions([types.INIT_INDEX_DATA])
  },
  created() {
    this.$store.dispatch(types.INIT_INDEX_DATA, { data: 10 });
  }
};
</script>

<style lang="less" scoped>
.home{
  margin-top: 46px;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  // height: 220px;
  height: 30vh;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe {
  .van-swipe-item {

  }
}
</style>
