<template>
  <div class="player">
    <div class="info-scope" @click="show=!show">
      <img :src="songInfo.picUrl ? songInfo.picUrl : songInfo.al.picUrl" alt :class="{active:isPlay}" class="rotate" />
      <div class="songInfo">
        <h5 class="s-name">{{songInfo.song ? songInfo.song.name : songInfo.al.name}}</h5>
        <span class="author">{{songInfo.song ? songInfo.song.artists[0].name : songInfo.ar[0].name}}</span>
      </div>
    </div>
    <div class="control">
      <canvas
        id="play-progress"
        width="25"
        height="25"
        @click="changePlayStatus"
        :class="{border:!play}"
      ></canvas>
      <img v-if="play" src="../../assets/stop.svg" />
      <!-- <i class="fa fa-bars" aria-hidden="true" @click="showPlayList = true"></i> -->
      <img v-else src="../../assets/play.svg" alt />
      <img src="../../assets/PlayList.svg" alt @click="showPlayList = !showPlayList" />
    </div>
    <audio :src="songUrl" controls></audio>
    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <div class="mask" v-if="showPlayList" @touchstart="showPlayList=!showPlayList"></div>
    </transition>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <CurrentPlayList v-if="showPlayList" :newSongsData="newSongsData"></CurrentPlayList>
    </transition>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
    >
      <BaseMusicPlayer
        v-if="show"
        :currentSong="songInfo"
        :show="show"
        @close="closeWindow($event)"
      ></BaseMusicPlayer>
    </transition>
  </div>
</template>

<script>
import CurrentPlayList from "../CurrentPlayList";
export default {
  // name: BaseMusicPlayer
  props: ["songUrl", "songInfo", "newSongsData"],
  created() {
    console.log("kk");
  },
  components: {
    CurrentPlayList
  },
  data() {
    return {
      play: true,
      isPlay: false,
      show: false,
      showPlayList: false
    };
  },
  methods: {
    changePlayStatus() {
      this.isPlay = !this.isPlay;
      this.play = !this.play;
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
        // audio.play();
        // that.isPlay = false;
        that.play = false;
      };
      audio.oncanplay = function() {
        audio.play();
        that.play = true;
        that.isPlay = true;
      };

      audio.ontimeupdate = function() {
        let currentProgress = ((this.currentTime / this.duration) * 100) / 50;
        context.clearRect(0, 0, 25, 25);
        //绘制播放按钮外圈样式
        // context.beginPath();
        // context.strokeStyle = "#888888";
        // context.lineWidth = 1.5;
        // // context.moveTo(0,0);
        // // context.lineTo(12.5,12.5);
        // context.arc(12.5, 12.5, 12.5, 0, 2 * Math.PI);
        // context.stroke();
        // context.closePath();
        //绘制圆形进度条
        context.beginPath();
        context.strokeStyle = "#FF0000";
        context.lineWidth = 1;
        context.arc(12.5, 12.5, 12, 0, currentProgress * Math.PI);
        context.stroke();
        context.closePath();
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
        document.body.style.overflowY = "hidden";
      } else {
        document.body.style.overflowY = "";
      }
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
  animation: rotate 6s linear infinite;
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
    top: 0;
  }
  .current-play-list {
    // margin: auto;
    z-index: 99999;
    position: fixed;
    width: 95%;
    left: 2.5%;
    bottom: 20px;
    height: 500px;
    border-radius: 20px;
    background-color: white;
    padding: 5px 10px 0px;
  }

  audio {
    height: 36px;
    display: none;
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