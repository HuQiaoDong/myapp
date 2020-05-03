<template>
  <div class="player">
    <div class="info-scope" @click="show=!show">
      <img :src="songInfo.picUrl" alt :class="{active:isPlay}" class="rotate" />
      <div class="songInfo">
        <h5 class="s-name">{{songInfo.song.name}}</h5>
        <span class="author">{{songInfo.song.artists[0].name}}</span>
      </div>
    </div>
    <div class="control">
      <canvas id="play-progress" width="25" height="25" @click="changePlayStatus"></canvas>
      <i :class="playBtn" aria-hidden="true"></i>
      <i class="fa fa-bars" aria-hidden="true" @click="showPlayList = true"></i>
    </div>
    <audio :src="songUrl" controls></audio>
    <transition name="custom-classes-transition" enter-active-class="animated fadeInUp">
      <CurrentPlayList v-if="showPlayList"></CurrentPlayList>
    </transition>

    <transition name="custom-classes-transition" enter-active-class="animated fadeInUp">
      <BaseMusicPlayer v-if="show" :currentSong="songInfo"></BaseMusicPlayer>
    </transition>
  </div>
</template>

<script>
import CurrentPlayList from "../CurrentPlayList";
export default {
  // name: BaseMusicPlayer
  props: ["songUrl", "songInfo"],
  created() {
    console.log("kk");
  },
  components: {
    CurrentPlayList
  },
  data() {
    return {
      playBtn: {
        fa: true,
        "fa-play": true,
        "fa-pause": false
      },
      isPlay: false,
      show: false,
      showPlayList: false,
    };
  },
  methods: {
    changePlayStatus() {
      this.isPlay = !this.isPlay;
      this.playBtn["fa-play"] = !this.playBtn["fa-play"];
      this.playBtn["fa-pause"] = !this.playBtn["fa-pause"];
      this.isPlay
        ? this.$el.querySelector("audio").play()
        : this.$el.querySelector("audio").pause();
    },
    drawProgress() {
      let audio = this.$el.querySelector("audio");
      /** @type HTMLAudioElement */
      /** @type HTMLCanvasElement */
      let canvas = this.$el.querySelector("canvas");
      let context = canvas.getContext("2d");
      let that = this;
      audio.onloadstart = function() {
        audio.play();
        that.isPlay = false;
        that.playBtn["fa-play"] = true;
        that.playBtn["fa-pause"] = false;
      };
      audio.oncanplay = function() {
        audio.play();
        that.isPlay = true;
        that.playBtn["fa-play"] = false;
        that.playBtn["fa-pause"] = true;
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
        context.arc(12.5, 12.5, 12.5, 0, currentProgress * Math.PI);
        context.stroke();
        context.closePath();
      };
    }
  },
  mounted() {
    this.drawProgress();
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
      z-index: 999;
      position: absolute;
      top: 1px;
      left: -8px;
      border: 1.5px solid #888888;
      box-sizing: border-box;
      border-radius: 50%;
    }
    // .fa-play{
    //   font-size: 5px;
    // }
    i {
      text-align: center;
      &:nth-child(2) {
        padding: 4px 0px 0px 1.5px;
        font-size: 5px;
        color: #666666;
      }
      &:nth-child(3) {
        font-size: 20px;
      }
    }
  }
}
</style>