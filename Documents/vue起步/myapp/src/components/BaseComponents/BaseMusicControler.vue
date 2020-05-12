<template>
  <div class="player">
    <div class="info-scope" @click="show=!show">
      <img :src="imgUrl(songInfo)" alt :class="{active:isPlay}" class="rotate" />
      <div class="songInfo" v-if="songInfo!=''">
        <h5 class="s-name">{{songName(songInfo)}}</h5>
        <span class="author">{{songAuthor(songInfo)}}</span>
      </div>
    </div>
    <div class="control">
      <canvas
        id="play-progress"
        width="25.5"
        height="25.5"
        @click="changePlayStatus"
        :class="{border:!isPlay}"
      ></canvas>
      <img v-if="isPlay" src="../../assets/stop.svg" />
      <!-- <i class="fa fa-bars" aria-hidden="true" @click="showPlayList = true"></i> -->
      <img v-else src="../../assets/play.svg" alt />
      <img src="../../assets/PlayList.svg" alt @click="showPlayList = !showPlayList" />
    </div>
    <audio :src="songUrl" controls style="display:none"></audio>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div class="mask" v-show="showPlayList" @touchstart="showPlayList=!showPlayList"></div>
    </transition>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <CurrentPlayList
        v-show="showPlayList"
        :newSongsData="newSongsData"
        :currentSongInfo="songInfo"
        @tran-song-id="$parent.getCurrentSongUrl($event)"
        @change-play-way="playWay = $event"
        :showPlayList="showPlayList"
        :playWay="playWay"
      ></CurrentPlayList>
    </transition>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <BaseMusicPlayer
        v-show="show"
        :currentSong="songInfo"
        :imgUrl="imgUrl(songInfo)"
        :songName="songName(songInfo)"
        :songAuthor="songAuthor(songInfo)"
        :show="show"
        :isPlay="isPlay"
        @close="closeWindow($event)"
        @trans-list-state="showPlayList = $event"
        :showPlayList="showPlayList"
        @change-play-way="playWay = $event"
        :playWay="playWay"
        :songIndex="songIndex"
        @trans-song-index="c_SongIndex = $event"
        :newSongsData="newSongsData"
      ></BaseMusicPlayer>
    </transition>
  </div>
</template>

<script>
import CurrentPlayList from "../CurrentPlayList";
export default {
  // name: BaseMusicPlayer
  props: ["songUrl", "songInfo", "newSongsData", "songIndex"],
  created() {},
  components: {
    CurrentPlayList
  },
  data() {
    return {
      scroll: false,
      c_SongIndex: this.songIndex,
      playWay: 1,
      isPlay: false,
      show: false,
      showPlayList: false,
      defalutPic: "../../assets/defaultImg.png",
      currentSongInfo: this.songInfo
    };
  },
  computed: {},
  methods: {
    imgUrl: function(songInfo) {
      if (songInfo.picUrl) {
        return songInfo.picUrl;
      } else if (songInfo.al) {
        return songInfo.al.picUrl;
      } else if (songInfo.artists) {
        return songInfo.artists[0].img1v1Url;
      }
      // return this.songInfo.picUrl || this.songInfo.al.picUrl || this.defalutPic;
    },
    songName: function(songInfo) {
      if (songInfo.song) {
        return this.songInfo.song.name;
      } else if (songInfo.al) {
        return songInfo.name;
      } else if (songInfo) {
        return songInfo.name;
      }
      // return this.songInfo.song
      //   ? this.songInfo.song.name
      //   : this.songInfo.al.name;
    },
    songAuthor: function(songInfo) {
      if (songInfo.song) {
        return songInfo.song.artists[0].name;
      } else if (songInfo.ar) {
        return songInfo.ar[0].name;
      } else if (songInfo.artists) {
        return songInfo.artists[0].name;
      }
      // return this.songInfo.song || this.songInfo.ar
      //   ? this.songInfo.song.artists[0].name || this.songInfo.ar[0].name
      //   : this.songInfo.artists[0].name;
    },
    // orderPlay() {},
    // randomPlay() {},
    // ReplaySong() {},
    changePlayStatus() {
      this.isPlay = !this.isPlay;
      console.log(this.$el.querySelector("audio"));

      this.isPlay
        ? this.$el.querySelector("audio").play()
        : this.$el.querySelector("audio").pause();
    },
    closeWindow(event) {
      this.show = event;
    },
    drawProgress() {
      let audio = this.$el.querySelector("audio");
      /** @type HTMLAudioElement */
      /** @type HTMLCanvasElement */
      let canvas = this.$el.querySelector("canvas");
      let context = canvas.getContext("2d");
      let that = this;
      audio.onloadstart = function() {
        // that.isPlay = false;
        that.isPlay = false;
      };
      audio.oncanplay = function() {
        audio.play();
        that.isPlay = true;
      };
      audio.onplay = function() {
        that.isPlay = true;
      };
      audio.onpause = function() {
        that.isPlay = false;
      };
      audio.ontimeupdate = function() {
        let currentProgress = ((this.currentTime / this.duration) * 100) / 50;
        // console.log(currentProgress);

        context.clearRect(0, 0, 26, 26);
        //绘制播放按钮外圈样式
        // context.beginPath();
        // context.strokeStyle = "#888888";
        // context.lineWidth = 1;
        // // context.moveTo(0,0);
        // // context.lineTo(12.5,12.5);
        // context.arc(12.5, 12.5, 12, 0, 2 * Math.PI);
        // context.stroke();
        // context.closePath();
        //绘制圆形进度条
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.arc(12.5, 12.5, 12.3, 0, currentProgress * Math.PI);
        context.stroke();
        context.closePath();

        // if(audio.ended){

        // }
        if (audio.ended) {
          // that.newSongsData.forEach(function(item, index) {
          //   if (that.songInfo == item) {
          //     console.log(index);
          //     // this.currentSongInfo =
          //     that.songIndex = index;
          //   }
          // });
          switch (that.playWay) {
            case 1:
              if (that.c_SongIndex >= that.newSongsData.length - 1) {
                that.c_SongIndex = 0;
              } else {
                that.c_SongIndex++;
              }
              that.$emit("tran-song-index", that.c_SongIndex);
              break;
            case 2:
              that.c_SongIndex;
              audio.play();
              break;
            case 3:
              that.c_SongIndex = Math.floor(
                Math.random() * that.newSongsData.length
              );
              that.$emit("tran-song-index", that.c_SongIndex);
              break;
          }

          console.log(that.c_SongIndex);

          // that.$parent.getCurrentSongUrl(that.newSongsData[that.songIndex]);
        }
      };
    }
  },
  mounted() {
    this.drawProgress();
  },
  watch: {
    showPlayList: function(value) {
      value;
      if (this.showPlayList) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        // document.body.style.overflowY = "";
      }
    },
    c_SongIndex: function(value) {
      this.$emit("trans-song-index", value);
    },
    songIndex: function(value) {
      this.c_SongIndex = value;
    },
    show:function(){
      document.body.style.overflow = "";
    }

  }
};
</script>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.rotate {
  transform: rotate(0deg);
  animation: rotate 10s linear infinite;
  animation-play-state: paused;
  &.active {
    animation-play-state: running;
  }
}

.player {
  padding: 3px 0px;
  position: fixed;
  width: 100%;
  height: 40px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #efefef;
  background-color: white;
  .mask {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 99999;
    top: 0;
  }

  audio {
    height: 36px;
    // display: none;
    position: absolute;
    top: -100px;
  }
  .info-scope {
    width: 82%;
    display: flex;
    margin-left: 3px;
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
    }
    .songInfo {
      margin-left: 5px;
      line-height: 1.2;
      h5 {
        font-size: 14px;
      }
      span {
        font-size: 12px;
        color: #888888;
      }
    }
  }
  .control {
    margin-right: 10px;
    display: flex;
    justify-content: space-between;
    padding: 5px 0px;
    position: relative;
    width: 50px;
    canvas {
      transform: rotate(-90deg);
      // z-index: 999;
      position: absolute;
      top: 2px;
      left: -8px;
      border: 1px solid #aaaaaa;
      box-sizing: border-box;
      border-radius: 50%;
    }
    .border {
      border: 1px solid #515151;
    }
    // .fa-play{
    //   font-size: 5px;
    // }
    img {
      text-align: center;
      &:nth-child(2) {
        margin: 0px 0px 2px -2px;
        // font-size: 5px;
        // color: #444444;
      }
      &:nth-child(3) {
        margin: 0px 0px -4px 0px;
        position: absolute;
        top: 0px;
        right: -15px;
      }
    }
  }
}
</style>