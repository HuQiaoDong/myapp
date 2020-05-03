<template>
  <li class="card" @click="routerPlayListPage(item.id,playCount)">
    <div class="thumb">
      <img :src="item.picUrl" alt />
      <span>
        <i class="fa fa-headphones" aria-hidden="true"></i>
        {{playCount}}
      </span>
    </div>
    <h5>{{item.name}}</h5>
  </li>
</template>

<script>
export default {
  data() {
    return {
      // card:this.cards[0],
      playCount: ""
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          id: 4969079749,
          type: 0,
          name: "欧美 | 欢快小调拯救你的不开心",
          copywriter: "编辑推荐：音乐是治愈人心的良药",
          picUrl:
            "https://p2.music.126.net/nflx5ZxSSPivvGnyS5WRGw==/109951164906376339.jpg",
          canDislike: false,
          trackNumberUpdateTime: 1586934907095,
          playCount: 1209355,
          trackCount: 100,
          highQuality: false,
          alg: "featured"
        };
      }
    }
  },
  methods:{
    getPlayCount(count) {
      // let newCount = this.item.playCount;
      if (count.toString().length >= 9) {
        return (count/100000000).toFixed(1) + "亿";
      }
      else{
        return (count/10000).toFixed(1) + "万";
      }
    },
    routerPlayListPage(songId,playCount){
      this.$router.push({path:'/playlist',query: {id: songId,playcount:playCount}});
    }
  },
  created() {
    this.playCount = this.getPlayCount(this.item.playCount);
    // console.log(this.playCount);
    // console.log(this.item);
    
  }
};
</script>

<style lang="less" scoped>
li {
  list-style: none;
}
.card {
  margin-bottom: 15px;
  // flex-grow: 1;
  .thumb {
    position: relative;
    img {
      vertical-align: middle;
    }
    span {
      font-size: 12px;
      position: absolute;
      top: 0;
      right: 0;
      color: white;
    }
  }
  h5 {
    font-size: 13px;
    color: #333333;
    padding: 6px 2px 0px 6px;
  }
}
</style>