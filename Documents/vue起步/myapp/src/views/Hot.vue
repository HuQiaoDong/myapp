<template>
  <div class="hot" :class="[currentSongInfo ?'margin-bottom-40px':'']">
    <BaseHomeLink></BaseHomeLink>
    <div class="title-img">
      <img src="../assets/hot_music_bg_2x.jpg" alt class="topImg"/>
      <div class="hot-desc"></div>
      <span>更新时间：5月28日</span>
    </div>

    <ul class="list">
      <li
        class="song-item"
        v-for="(item,index) in hotSongs.tracks"
        :key="index"
        @click="sendSongId(item,hotSongs.tracks)"
      >
        <div class="index" v-if="(index+1)<10" :class="[(index+1)<=3?'red':'']">{{'0'+(index+1)}}</div>
        <div class="index" v-else>{{index+1}}</div>
        <div class="songinfo">
          <div class="top">
            <div class="song-name">
              {{item.name}}
              <span
                class="desc"
                :title="item.alias ? item.alias[0].name:''"
              >{{item.alias ? item.alias[0].name:''}}</span>
            </div>
          </div>
          <p class="bottom">
            <i class="icon icon-quality"></i>
            <span>{{getArticleInfo(item)}}</span>
          </p>
          <i :class="[currentSongInfo.id == item.id? playing : pause ]"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hotSongs: null,
      playing: {
        fa: true,
        "fa-volume-up": true
      },
      pause: {
        icon: true,
        "icon-play": true
      }
    };
  },
  props: ["currentSongInfo"],
  methods: {
    getHotSongList() {
      this.axios
        .get("/top/list", {
          params: {
            idx: 1
          }
        })
        .then(response => {
          this.hotSongs = response.data.playlist;
          window.localStorage.setItem(
            "hotsong",
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
    getArticleInfo(songItem) {
      return (
        songItem.ar.map(artist => artist.name).join("/") +
        "-" +
        songItem.al.name
      );
    },
    sendSongId(item, hotSongs) {
      // console.log(item.id);
      this.$emit("tran-song-id", item);
      this.$emit("tran-song-data", hotSongs);
    }
  },

  created() {
    const cacheHotSongList = JSON.parse(window.localStorage.getItem("hotsong"));
    if (cacheHotSongList && cacheHotSongList.expire > Date.now()) {
      this.hotSongs = cacheHotSongList.result;
      console.log("从缓存中获取热歌榜数据");
    } else {
      this.getHotSongList();
    }
    // console.log(cachePersonalizeds);
  }
};
</script>

<style lang="less" scoped>
.hot {
  .title-img {
    position: relative;
    img {
        filter: brightness(0.8);
    }
    .hot-desc {
      position: absolute;
      top: 25px;
      left: 20px;
      width: 142px;
      height: 67px;
      background: url(../assets/index_icon_2x.png) no-repeat -24px -30px;
      background-size: 166px 97px;
    }
    span{
      color:white;
      font-size: 12px;
      bottom:35px;
      left: 20px;
      position: absolute;
    }
  }
}
.list {
  position: relative;
  li {
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
  .song-item {
    height: 55px;
    // padding: 6px 0px;
    position: relative;
    display: flex;
    .index {
      font-size: 17px;
      color: #999999;
      width: 40px;
      height: 55px;
      text-align: center;
      line-height: 55px;
      &.red{
        color: red;
      }
    }
    .songinfo {
      width: 90%;
      padding: 6px 0px;
      border-bottom: 1px solid #efefef;
    }
    .top {
      .song-name {
        color: #333333;
        width: 320px;
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
      width: 320px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      span {
        color: #888888;
        font-size: 12px;
      }
    }
  }
}
.icon {
  background-image: url("../assets/index_icon_2x.png");
  display: inline-block;
  background-size: 166px auto;

  &.icon-quality {
    width: 12px;
    height: 8px;
    margin: 0 5px 0 2px;
  }
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