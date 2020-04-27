<template>
  <div class="playlist">
    <header class="header">
      <div class="mask" :style="{backgroundImage: `url(${songListDetail.coverImgUrl})`}"></div>
      <div class="left">
        <img :src="songListDetail.coverImgUrl" alt />
        <span>
          <i class="fa fa-headphones" aria-hidden="true"></i>
          {{playCount}}
        </span>
        <i class="gedan-icon">歌单</i>
      </div>
      <div class="right">
        <h2>{{songListDetail.name}}</h2>
        <div class="actor">
          <img :src="songListDetail.creator.avatarUrl" alt />
          <span>{{songListDetail.creator.nickname}}</span>
        </div>
      </div>
    </header>
    <div class="info">
      <div class="tags">
        <label>标签：</label>
        <span v-for="(tag,index) in tags" :key="index">{{tag}}</span>
      </div>
    </div>

    <!-- playlistID:{{$route.query.id}} -->
  </div>
</template>

<script>
export default {
  name: "PlayList",
  data() {
    return {
      songListId: this.$route.query.id,
      playCount: this.$route.query.playcount,
      songListDetail: ""
      // tags:this.songListDetail.tags,
    };
  },
  methods: {
    getSongListDetail() {
      this.axios
        .get("/playlist/detail", {
          params: {
            id: this.songListId
          }
        })
        .then(response => {
          this.songListDetail = response.data.playlist;
          window.localStorage.setItem(
            "sl-" + this.$route.query.id,
            JSON.stringify({
              expire: Date.now() * 3 * 60 * 60 * 1000,
              result: response.data.playlist
            })
          );
          // console.log(this.songListDetail);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  },
  created() {
    // this.getSongListDetail();
    const cacheSongListDetail = JSON.parse(
      window.localStorage.getItem(`sl-${this.$route.query.id}`)
    );
    if (cacheSongListDetail && cacheSongListDetail.expire > Date.now()) {
      console.log("从缓存取出数据");

      this.songListDetail = cacheSongListDetail.result;
      console.log(this.songListDetail.tags);
      this.tags = this.songListDetail.tags;
    } else {
      console.log("ajax获取新数据");

      this.getSongListDetail();
    }
    // console.log(cacheSongListDetail);
    // console.log(this.songListDetail);
    // console.log(this.songListDetail.coverImgUrl);
  },
  //   组件被创建之后的路由更新
  beforeRouteUpdate(to, from, next) {
    console.log(to, from);
    from;
    this.songListId = to.query.id;
    this.playCount = to.query.playcount;
    next();
  }
};
</script>

<style lang="less" scoped>
.playlist {
  width: 420px;
  height: 200px;
  .header {
    display: flex;
    width: 100%;
    height: 100%;
    // background: url();
    padding: 30px 10px 30px 15px;
    position: relative;
    color: white;
    overflow: hidden;
    .mask {
      position: absolute;
      top: 0px;
      left: 0px;
      filter: blur(30px) brightness(0.8);
      width: 100%;
      height: 100%;
      z-index: -1;
      transform: scale(1.5);
      background-position: center;
    }
    .left {
      position: relative;
      font-size: 12px;
      line-height: 18px;
      img {
        width: 140px;
        // height: 140px;
      }
      span {
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .gedan-icon {
        font-style: normal;
        text-align: center;
        color: white;
        width: 40px;
        height: 16px;
        line-height: 16px;
        background: #e8234a;
        position: absolute;
        left: 0px;
        top: 10px;
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
      }
    }
    .right {
      margin-left: 16px;
      h2 {
        //   color: #fefefe;
        font-size: 17px;
        height: 44px;
        padding: 5px 0 20px 0;
      }
      .actor {
        margin-top: 20px;
        img {
          border-radius: 50%;
          width: 30px;
          height: 30px;
          vertical-align: middle;
        }
        span {
          font-size: 14px;
          padding-left: 10px;
          color: hsla(0, 0%, 100%, 0.7);
        }
      }
    }
  }
  .info {
    color:#686868;
    padding: 10px 15px;
    .tags {
      span {
        display: inline-block;
        margin-right: 10px;
        font-size: 12px;
        padding: 1px 8px;
        border: 1px solid #efefef;
        border-radius: 10px;
        color: #6f6f6f;
      }
    }
  }
}
</style>