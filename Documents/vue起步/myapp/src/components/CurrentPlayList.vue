<template>
  <div class="current-play-list">
    <header>
      <h3>
        <span>当前播放</span>
        <span>{{`(${newSongsData.length})`}}</span>
      </h3>
      <div @click="switchPlayWay" class="playway">
        <img :src="playWayIcon" alt />
        <span>{{playWayText}}</span>
      </div>
    </header>

    <ul class="playlist">
      <li v-for="(item,index) in newSongsData" :key="index">
        <div class="songInfo" @click="playIndex(item,index)">
          <span
            :class="currentSongInfo.id == item.id ? 'playing': ''"
          >{{item.name || item.song.name|| item.al.name}}</span>
          <span :class="currentSongInfo.id == item.id ? 'playing' : ''">-{{getArticleInfo(item)}}</span>
        </div>

        <em>x</em>
      </li>
    </ul>
  </div>
</template>

<script>
// import NewSongItem from "../components/NewSongItem";
export default {
  name: "CurrentPlayList",
  props: ["newSongsData", "currentSongInfo","playWay"],
  data() {
    return {
      playList: this.newSongsData,
      songIndex: "",
      l_PlayWay: 1,
      playWayIcon: require("../assets/order.svg"),
      playWayText: "列表循环"
    };
  },
  components: {
    // NewSongItem
  },
  methods: {
    switchPlayWay() {
      if (this.l_PlayWay >= 3) {
        this.l_PlayWay = 1;
      } else {
        this.l_PlayWay++;
      }
      switch (this.l_PlayWay) {
        case 1:
          this.playWayIcon = require("../assets/order.svg");
          this.playWayText = "列表循环";
          break;
        case 2:
          this.playWayIcon = require("../assets/loop.svg");
          this.playWayText = "单曲循环";
          break;
        case 3:
          this.playWayIcon = require("../assets/random.svg");
          this.playWayText = "随机播放";
          break;

        default:
          break;
      }
      this.$emit("change-play-way", this.l_PlayWay);
    },
    getArticleInfo(songItem) {
      if (songItem.song) {
        return songItem.song.artists.map(artist => artist.name).join("/");
      } else if (songItem.ar) {
        return songItem.ar.map(ar => ar.name).join("/");
      } else if (songItem.artists) {
        return songItem.artists.map(artist => artist.name).join("/");
      }
    },
    playIndex(item, songIndex) {
      this.$emit("tran-song-id", item);
      // this.$emit('tran-song-id',item)
      console.log(songIndex);
    }
  },
  watch: {
    currentSongInfo: function(value) {
      console.log("当前歌曲", value);
    },
    playWay: function(value) {
      this.l_PlayWay = value;
      switch (this.l_PlayWay) {
        case 1:
          this.playWayIcon = require("../assets/order.svg");
          this.playWayText = "列表循环";
          break;
        case 2:
          this.playWayIcon = require("../assets/loop.svg");
          this.playWayText = "单曲循环";
          break;
        case 3:
          this.playWayIcon = require("../assets/random.svg");
          this.playWayText = "随机播放";
          break;

        default:
          break;
      }
    }

  },
  mounted() {
    // let audio = document.querySelector("audio");
    // console.log(this);
    // console.log("list", audio);
  }
};
</script>

<style lang="less" scoped>
.current-play-list {
  color: #333333;
  z-index: 99999;
  position: fixed;
  width: 95%;
  left: 2.5%;
  bottom: 20px;
  height: 500px;
  border-radius: 20px;
  background-color: white;
  padding: 20px 20px 0px;

  header {
    .playway {
      display: inline-block;
    }
    h3 {
      margin-bottom: 10px;
      span {
        &:nth-child(1) {
          font-weight: 500;
          color: black;
          font-size: 18px;
        }
        &:nth-child(2) {
          font-size: 14px;
          color: #888888;
        }
      }
    }
    img {
      margin-right: 3px;
      vertical-align: sub;
      width: 20px;
      height: 20px;
      color: black;
    }
  }
  em {
    font-style: normal;
  }
  ul {
    height: 85%;
    scroll-behavior: auto;
    overflow-y: scroll;
    margin-top: 15px;
    li {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      .songInfo {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 75vw;
        .playing {
          color: red !important;
        }
        span {
          &:nth-child(1) {
            font-size: 17px;
            color: #333333;
          }
          &:nth-child(2) {
            font-size: 12px;
            color: #888888;
          }
        }
      }
      em {
        font-size: 23px;
        color: #a7a7a7;
      }
    }
  }
}
</style>