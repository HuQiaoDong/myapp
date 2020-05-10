<template>
  <div class="playlist">
    <header class="header">
      <i class="fa fa-arrow-left" @click="returnLastRouter"></i>
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
          <img :src="songListDetail ? songListDetail.creator.avatarUrl :''" alt />
          <span>{{songListDetail?songListDetail.creator.nickname:''}}</span>
        </div>
      </div>
    </header>
    <div class="info">
      <div class="tags" v-if='tags!=""'>
        <label>标签：</label>
        <span v-for="(tag,index) in tags" :key="index">{{tag}}</span>
      </div>
      <div  @click="ctlDescHidden()">
        <div :class="descClass">简介：{{songListDetail.description}}</div>
        <i class="fa drop-down" :class="[descClass.hidden ? 'fa-angle-down' : 'fa-angle-up']"></i>
      </div>
    </div>
    <div class="songList" :class="[currentSongInfo ?'margin-bottom-40px':'']">
      <p class="title">歌曲列表</p>
      <li
        v-for="(item,index) in songListDetail.tracks"
        :key="index"
        class="song-item"
        @click="sendDataToControler(item,songListDetail.tracks)"
        @touchstart="playing = !playing"
      >
        <div class="index">{{index+1}}</div>
        <div class="songinfo">
          <div class="top">
            <div class="song-name">
              {{item.name}}
              <span class="desc" :title="item.alia[0]">{{item.alia[0]}}</span>
            </div>
          </div>
          <p class="bottom">
            <span>{{getArticleInfo(item)}}</span>
          </p>
          <i class="fa fa-volume-up" v-if="currentSongInfo && currentSongInfo.id == item.id"></i>
          <i class="icon icon-play" v-else></i>
        </div>
      </li>
    </div>
    <!-- playlistID:{{$route.query.id}} -->
  </div>
</template>

<script>
export default {
  name: "PlayList",
  data() {
    return {
      playing: false,
      songListId: this.$route.query.id,
      playCount: this.$route.query.playcount,
      songListDetail: "",
      tags:[],
      descClass: {
        hidden: true,
        description: true
      }
    };
  },
  props: ["currentSongInfo"],
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
          this.tags = response.data.playlist.tags;
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
    },
    ctlDescHidden() {
      this.descClass.hidden = !this.descClass.hidden;
      // console.log(this.descClass.hidden);
    },
    getArticleInfo(songItem) {
      // console.log(songItem);

      return songItem.ar.map(ar => ar.name).join("/") + "-" + songItem.al.name;
    },
    returnLastRouter() {
      this.$router.go(-1);
    },
    sendDataToControler(item, tracks) {
      console.log(item, tracks);
      this.$emit("tran-song-id", item);
      this.$emit("tran-song-data", tracks);
    }
  },

  // created() {
  //   // this.getSongListDetail();
  //   const cacheSongListDetail = JSON.parse(
  //     window.localStorage.getItem(`sl-${this.$route.query.id}`)
  //   );
  //   if (cacheSongListDetail && cacheSongListDetail.expire > Date.now()) {
  //     console.log("从缓存取出数据");

  //     this.songListDetail = cacheSongListDetail.result;
  //     console.log(this.songListDetail.tags);
  //     this.tags = this.songListDetail.tags;
  //   } else {
  //     console.log("ajax获取新数据");

  //     this.getSongListDetail();
  //   }
  // },
  //   组件被创建之后的路由更新
  // beforeRouteUpdate(to, from, next) {
  //   console.log(to, from);
  //   from;
  //   this.songListId = to.query.id;
  //   this.playCount = to.query.playcount;
  //   next();
  // },
  beforeRouteEnter(to, from, next) {
    const cacheSongListDetail = JSON.parse(
      window.localStorage.getItem(`sl-${to.query.id}`)
    );
    if (cacheSongListDetail && cacheSongListDetail.expire > Date.now()) {
      console.log("从缓存取出数据");
      let songListDetail = cacheSongListDetail.result;
      // this.songListDetail =
      // console.log(this.songListDetail.tags);
      let tags = songListDetail.tags;
      // console.log(sld, ts);
      next(vm => {
        vm.songListId = to.query.id;
        vm.songListDetail = songListDetail;
        vm.tags = tags;
        // console.log(vm.descClass);
      });
    } else {
      window.axios
        .get("/playlist/detail", {
          params: {
            id: to.query.id
          }
        })
        .then(response => {
          console.log(response);

          let playlist = response.data.playlist;
          let tags = response.data.playlist.tags;
          next(vm => {
            vm.songListId = to.query.id;
            vm.songListDetail = playlist;
            vm.tags = tags;
            // console.log(vm.descClass);
          });
          window.localStorage.setItem(
            "sl-" + to.query.id,
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
  }
};
</script>

<style lang="less" scoped>
.playlist {
  .header {
    display: flex;
    width: 100%;
    height: 100%;
    // background: url();
    padding: 30px 10px 30px 15px;
    position: relative;
    color: white;
    overflow: hidden;
    > i {
      position: absolute;
      top: 7px;
      left: 7px;
      font-size: 20px;
    }
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
    // position: relative;
    color: #686868;
    padding: 10px 15px;
    .tags {
      padding-bottom: 10px;
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
    .description {
      font-size: 14px;
      color: #666666;
    }
    .hidden {
      // height: 4em;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    .drop-down {
      float: right;
      font-size: 20px;
      color: #bebebe;
    }
  }
  .songList {
    .title {
      height: 20px;
      background-color: #eeeff0;
      line-height: 20px;
      text-indent: 1em;
      margin-top: 7px;
      font-size: 12px;
      color: #666666;
    }
    .song-item {
      display: flex;
      list-style: none;
      border-bottom: 1px #f0f0f0 solid;
      height: 55px;
      padding: 6px 0px;
      position: relative;
      .index {
        font-size: 17px;
        color: #999999;
        width: 40px;
        height: 43px;
        text-align: center;
        line-height: 43px;
      }
      .fa {
        display: inline-block;
        width: 25px;
        height: 25px;
        line-height: 25px;
        text-align: center;
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        // padding: 0 10px;
        &.fa-volume-up {
          color: red;
        }
      }
      .top {
        .song-name {
          color: #333333;
          width: 300px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 17px;
          .desc {
            width: 260px;
            //   display: inline-block;
            margin-left: 5px;
            color: #888888;
          }
        }
      }

      .bottom {
        span {
          width: 300px;
          display: inline-block;
          color: #888888;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
}
.icon {
  background-image: url("../assets/index_icon_2x.png");
  display: inline-block;
  background-size: 166px auto;
  &.icon-play {
    width: 25px;
    height: 25px;
    background-position-x: -23px;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 0 10px;
  }
}
.margin-bottom-40px{
  margin-bottom: 40px;
}
</style>