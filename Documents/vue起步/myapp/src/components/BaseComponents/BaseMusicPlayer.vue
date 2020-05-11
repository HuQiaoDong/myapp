<template>
  <transition name="custom-classes-transition" leave-active-class="animated fadeOutDown">
    <div class="music-player">
      <div class="mask" :style="{backgroundImage: `url(${imgUrl})`}"></div>
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="cover" v-if="!lyric">
          <img src="../../assets/needle.png" alt class="needle" />
          <img :src="imgUrl" alt class="cover-img rotate" :class="{active:isPlay}" />
          <img src="../../assets/disc-ip6.png" alt class="border" @click="lyric=!lyric" />
        </div>
      </transition>
      <header>
        <i class="fa fa-arrow-left" aria-hidden="true" @click="closeWindow()"></i>
        <div class="song-info">
          <div class="songTitle">
            <h3>{{songName}}</h3>
            <span>
              <!-- v-if="currentSong.song.alias[0]||currentSong.alia" -->
              <!-- {{songAuthor}} -->
            </span>
          </div>
          <p>{{songAuthor}}</p>
        </div>
      </header>
      <transition
        name="custom-classes-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="lyric" v-show="lyric">
          <div class="volume-controler">
            <i class="fa fa-volume-up" @click="controlVolume"></i>
            <div class="control-bar">
              <span class="progress"></span>
              <span class="dragPoint volume"></span>
            </div>
          </div>
          <div class="wrap" @click="lyric=!lyric">
            <ul :style="{transform: `translateY(${-currentLyricIndex * 28}px)`}" class="scroll">
              <li
                v-for="(row,index) in parsedLyric"
                :key="index"
                class="lyricRow"
                :class="{active: index===currentLyricIndex}"
              >{{row.text}}</li>
            </ul>
          </div>
        </div>
      </transition>

      <footer>
        <div class="k-bar">
          <span
            class="currentProgress"
          >{{progressBarData ? `${progressBarData.currentMinute}:${progressBarData.currentSecond}`:"00:00"}}</span>
          <div class="progress-bar">
            <div class="control-bar">
              <span
                class="progress"
                :style='{"width":(progressBarData ? progressBarData.time+"px":"")}'
              ></span>
              <!-- ${progressBarData.time}px`:width:0px} -->
              <span
                class="dragPoint process"
                :style='{"left":(progressBarData ? progressBarData.t+"px":"")}'
              ></span>
            </div>
          </div>
          <span
            class="totalProgress"
          >{{progressBarData ?`${progressBarData.songMinute}:${progressBarData.songSecond}`:"00:00"}}</span>
        </div>
        <div class="play-control">
          <img :src="playWayIcon" alt class="con" @click="changePlayWay" />
          <img src="../../assets/prev.svg" alt class="con" @click="lastSong" />
          <img src="../../assets/stop2.svg" v-if="isPlay" alt class="ppp" @click="playState()" />
          <img src="../../assets/play2.svg" v-else alt class="ppp" @click="playState()" />
          <img src="../../assets/next.svg" alt class="con" @click="nextSong" />
          <img src="../../assets/PlayList2.svg" alt class="con" @click="showList" />
        </div>
      </footer>
    </div>
  </transition>
</template>

<script>
export default {
  // mounted() {
  //   document.body.style.overflow = "hidden"; //禁止滚动
  //   // console.log(window.innerHeight, this.$el)
  //   this.$el.style.height = window.innerHeight + "px";
  // },
  data() {
    return {
      //   show:this.show,
      playWayIcon:require("../../assets/order2.svg"),
      p_ShowPlayList: this.showPlayList,
      lyric: false,
      currentLyric: null,
      currentLyricIndex: "",
      progressBarData: null,
      p_PlayWay:1,
      p_SongIndex:this.songIndex,
      // p_SongIndex: this.songIndex
    };
  },
  props: [
    "currentSong",
    "show",
    "imgUrl",
    "songName",
    "songAuthor",
    "isPlay",
    "showPlayList",
    "playWay",
    "songIndex",
    "newSongsData"
  ],
  methods: {
    dragBar: function(audio, el, site) {
      audio, el, site;
    },
    controlVolume() {
      let audio = document.querySelector("audio");
      if (audio) {
        audio.muted = !audio.muted;
      }
    },
    closeWindow: function() {
      this.playerShow = !this.show;
      this.$emit("close", this.playerShow);
      // this.close = !close;
      document.body.style.overflow = "";
    },
    getLyric: function() {
      var cachedLyric = window.localStorage.getItem(
        "lyric" + this.currentSong.id
      );

      if (cachedLyric) {
        this.currentLyric = cachedLyric;
      } else {
        console.log("get");

        window.axios
          .get("lyric", {
            params: {
              id: this.currentSong.id
            }
          })
          .then(response => {
            this.currentLyric = response.data.lrc.lyric;
            console.log(this.currentLyric);

            window.localStorage.setItem(
              "lyric" + this.currentSong.id,
              response.data.lrc.lyric
            );
          });
      }
    },
    changePlayWay() {
      if (this.p_PlayWay >= 3) {
        this.p_PlayWay = 1;
      } else {
        this.p_PlayWay++;
      }
      switch (this.p_PlayWay) {
        case 1:
          this.playWayIcon = require("../../assets/order2.svg");
          break;
        case 2:
          this.playWayIcon = require("../../assets/loop2.svg");
          break;
        case 3:
          this.playWayIcon = require("../../assets/random2.svg");
          break;

        default:
          break;
      }
      this.$emit('change-play-way',this.p_PlayWay);
    },
    lastSong() {

      if (this.p_SongIndex <= 0) {
        this.p_SongIndex = this.newSongsData.length -1;
      }
      else{
        this.p_SongIndex--;
      }
      this.$emit("trans-song-index", this.p_SongIndex);
    },

    playState() {
      this.$parent.changePlayStatus();
    },

    nextSong() {
      // console.log(this.$root.$children[0]);

      if (this.p_SongIndex >= this.newSongsData.length-1) {
        this.p_SongIndex = 0;
      }else{
        this.p_SongIndex++;
      }
      this.$emit("trans-song-index", this.p_SongIndex);
    },
    showList() {
      this.p_ShowPlayList = !this.p_ShowPlayList;
      this.$emit("trans-list-state", this.p_ShowPlayList);
    }
  },
  computed: {
    parsedLyric: function() {
      if (this.currentLyric) {
        return this.currentLyric.split("\n").map(item => {
          // console.log(item);
          var regex = /\d{2}:\d{2}\.\d+/i;
          if (item.search(regex) !== -1) {
            var time = item.match(regex)[0];
            var m = time.substr(0, 2);
            var s = time.substr(3, 2);
            var n = time.substr(5);
            let k;
            if (n.length == 4) {
              k = 11;
            } else if (n.length == 3) {
              k = 10;
            }
            return {
              time: Number(m) * 60 + Number(s) + Number(n),
              text: item.substr(k) || "---------"
            };
          } else {
            return {};
          }
        });
      } else {
        return null;
      }
    },
  },
  mounted() {
    if (this.show) {
      document.body.style.overflow = "hidden"; //禁止滚动
    } else {
      document.body.style.overflow = ""; //禁止滚动
    }

    let audio = this.$parent.$el.querySelector("audio");
    let dragPoint = this.$el.getElementsByClassName("dragPoint");
    // let processDragPoint = this.$el.querySelector(".process");
    let site = this.$el.getElementsByClassName("control-bar");
    let progress = this.$el.getElementsByClassName("progress");
    this.$el.style.height = "100vh";
    console.log(dragPoint, progress, site);
    // this.dragBar(audio,dragPoint,site);

    // 音量控制
    // 点击
    site[0].onmousedown = function(e) {
      let ev = window.event || e;
      if (ev.button == 0) {
        let bili = site[0].offsetWidth / 100;

        let k = (ev.pageX - site[0].offsetLeft) / bili / 100;
        let t = k * 100 * bili - dragPoint[0].offsetWidth / 2;
        if (k <= 1 && k >= 0) {
          audio.volume = k;
          progress[0].style.width = k * 100 * bili + "px";
          dragPoint[0].style.left = t + "px";
        }
      }
    };
    //拖拽
    dragPoint[0].addEventListener("touchstart", function(e) {
      let ev = e || window.event;
      console.log(ev, "拖拽开始");

      dragPoint[0].addEventListener("touchmove", function(e) {
        let ev = e || window.event;
        let touch = ev.targetTouches[0];

        e.preventDefault();

        let bili = site[0].offsetWidth / 100;

        let k = (touch.pageX - site[0].offsetLeft) / bili / 100;
        let t = k * 100 * bili - dragPoint[0].offsetWidth / 2;
        if (k <= 1 && k >= 0) {
          audio.volume = k;
          progress[0].style.width = k * 100 * bili + "px";
          dragPoint[0].style.left = t + "px";
        }

        // console.log(((touch.pageX - site[0].offsetLeft) /(site[0].offsetWidth/100))/100);
        // that.audio.muted = true;
        // let bili = this.site.offsetWidth / 100;
        // this.dragPoint.style.left = time - this.dragPoint.offsetWidth / 2 + 'px';
      });
      dragPoint[1].addEventListener("touchend", function(e) {
        let ev = e || window.event;
        e.preventDefault();
        // that.audio.muted = false;
      });
    });
    // 播放进度控制
    // 点击
    site[1].onmousedown = function(e) {
      let ev = window.event || e;
      console.log("click");
      if (ev.button == 0) {
        audio.currentTime =
          ((ev.pageX - site[1].offsetParent.offsetLeft - site[1].offsetLeft) /
            site[1].offsetWidth) *
          audio.duration;

        // audio.currentTime =
        //   ((ev.pageX - site[1].offsetParent.offsetLeft - site[1].offsetLeft) /
        //     site[1].offsetWidth) *
        //   audio.duration;
        let bili = site[1].offsetWidth / 100;

        let time = (audio.currentTime / audio.duration) * 100 * bili;
        progress[1].style.width = time + "px";
        dragPoint[1].style.left = time - dragPoint[1].offsetWidth / 2 + "px";
      }
      // ev.button == 0 ? that.jump(ev) : ev;
    };
    // 拖拽
    dragPoint[1].addEventListener("touchstart", function(e) {
      let ev = e || window.event;

      dragPoint[1].addEventListener("touchmove", function(e) {
        let ev = e || window.event;
        let touch = ev.targetTouches[0];
        // console.log(ev);
        // dragPoint[1].style.width = 15 +'px';
        dragPoint[1].style.transform = "scale(1.3)";
        // audio.currentTime =
        e.preventDefault();
        console.log(touch);
        audio.currentTime =
          ((touch.pageX -
            site[1].offsetParent.offsetLeft -
            site[1].offsetLeft) /
            site[1].offsetWidth) *
          audio.duration;

        audio.muted = true;
        // let bili = this.site.offsetWidth / 100;
        // this.dragPoint.style.left = time - this.dragPoint.offsetWidth / 2 + 'px';
      });
      dragPoint[1].addEventListener("touchend", function(e) {
        let ev = e || window.event;
        dragPoint[1].style.transform = "scale(1)";
        e.preventDefault();
        audio.muted = false;
      });
    });

    // document.addEventListener
    audio.addEventListener("timeupdate", () => {
      if (this.parsedLyric) {
        let index;
        for (let i = 0; i < this.parsedLyric.length; i++) {
          if (audio.currentTime + 0.15 < this.parsedLyric[i].time) {
            index = i - 1;
            break;
          }
        }
        if (index === undefined) {
          index = this.parsedLyric.length - 1;
        }
        this.currentLyricIndex = index;
      }

      let bili = site[1].offsetWidth / 100;

      let time = (audio.currentTime / audio.duration) * 100 * bili;
      progress[1].style.width = time + "px";
      let t = time - dragPoint[1].offsetWidth / 2;
      // console.log(time, t);

      dragPoint[1].style.left = t + "px";

      let currentMinute = Math.floor(audio.currentTime / 60);
      let currentSecond = Math.floor(audio.currentTime % 60);
      Math.floor(audio.currentTime / 60) < 10
        ? (currentMinute = "0" + currentMinute)
        : (currentMinute = currentMinute);
      Math.floor(audio.currentTime % 60) < 10
        ? (currentSecond = "0" + currentSecond)
        : (currentSecond = currentSecond);

      let songMinute = Math.floor(audio.duration / 60);
      let songSecond = Math.floor(audio.duration % 60);
      Math.floor(audio.duration / 60) < 10
        ? (songMinute = "0" + songMinute)
        : (songMinute = songMinute);
      Math.floor(audio.duration % 60) < 10
        ? (songSecond = "0" + songSecond)
        : (songSecond = songSecond);
      this.$el.querySelector(
        ".currentProgress"
      ).innerHTML = `${currentMinute}:${currentSecond}`;

      if (audio.paused) {
        this.progressBarData = {
          currentMinute,
          currentSecond,
          songMinute,
          songSecond,
          time,
          t
        };
      }

      this.$el.querySelector(
        ".totalProgress"
      ).innerHTML = `${songMinute}:${songSecond}`;
    });
  },
  created() {
    this.getLyric();
  },
  watch: {
    show: function(value) {
      if (value) {
        document.body.style.overflow = "hidden"; //禁止滚动
      } else {
        document.body.style.overflow = "";
      }

      let audio = this.$parent.$el.querySelector("audio");
      let dragPoint = this.$el.getElementsByClassName("dragPoint");
      // let processDragPoint = this.$el.querySelector(".process");
      let site = this.$el.getElementsByClassName("control-bar");
      let progress = this.$el.getElementsByClassName("progress");

      let bili = site[1].offsetWidth / 100;
      let time = (audio.currentTime / audio.duration) * 100 * bili;

      progress[1].style.width = time + "px";
      let t = time - dragPoint[1].offsetWidth / 2;
      // console.log(time, t);

      dragPoint[1].style.left = t + "px";
    },
    lyric: function(value) {
      let audio = this.$parent.$el.querySelector("audio");
      let site = this.$el.getElementsByClassName("control-bar");
      let dragPoint = this.$el.getElementsByClassName("dragPoint");
      let progress = this.$el.getElementsByClassName("progress");
      audio.volume = 0.5;
      console.log(
        site[0].offsetWidth / 2,
        site[0].offsetWidth / 2 - dragPoint[0].offsetWidth / 2
      );
      progress[0].style.width = site[0].offsetWidth / 2 + "px";
      dragPoint[0].style.left =
        site[0].offsetWidth / 2 - dragPoint[0].offsetWidth / 2 + "px";
    },
    currentSong: function(value) {
      this.getLyric();
    },
    showPlayList: function(value) {
      value;
      if (this.showPlayList) {
        console.log("xxx");

        document.body.style.overflow = "hidden";
      } else {
        console.log("ggg");

        document.body.style.overflow = "hidden";
      }
    },
    songIndex:function(value){
       this.p_SongIndex=value
    },
    // playWay:function(){
    //   this.changePlayWay();
    // }
    playWay:function(value){
      this.p_PlayWay = value;
      switch (this.p_PlayWay) {
        case 1:
          this.playWayIcon = require("../../assets/order2.svg");
          break;
        case 2:
          this.playWayIcon = require("../../assets/loop2.svg");
          break;
        case 3:
          this.playWayIcon = require("../../assets/random2.svg");
          break;

        default:
          break;
      }
      this.$emit('change-play-way',this.p_PlayWay);
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
.music-player {
  position: fixed;
  top: 0;
  height: 100vh;
  z-index: 2000;
  width: 100%;
  .lyric {
    width: 100%;
    color: #cacacc;
    z-index: 8888;
    height: 70vh;
    //   音量条
    .wrap {
      position: relative;
      overflow-y: scroll;
      // overflow: hidden;
      height: 100%;
    }
    .volume-controler {
      width: 100%;
      padding: 5%;
      display: flex;
      i {
        font-size: 14px;
        margin-right: 10px;
      }
    }

    ul {
      position: absolute;
      top: 30%;
      left: 0;
      right: 0;
      &.scroll {
        transition: transform 0.3s;
      }
      .lyricRow {
        height: 28px;
        line-height: 28px;
        text-align: center;
        &.active {
          color: white;
        }
      }
    }
  }
  header {
    display: flex;
    color: #efefef;
    height: 50px;
    background-color: rgba(100, 100, 100, 0.2);
    .song-info {
      padding: 5px 0px;
      > p {
        font-size: 12px;
        color: #888888;
      }
      .songTitle {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 80vw;
        h3 {
          display: inline-block;
        }
      }
    }
    i {
      height: inherit;
      padding: 15px 10px;
      font-size: 20px;
    }
  }
  background-color: rgba(0, 0, 0, 0);
  .mask {
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(100, 100, 100, 0.5);
    filter: blur(30px) brightness(0.5);
    transform: scale(2);
    width: inherit;
    z-index: -1;
    background-size: cover;
    background-position: center;
  }
  .cover {
    position: relative;
    .needle {
      z-index: 10;
      width: 100px;
      position: absolute;
      top: 50px;
      left: 0;
      right: 0;
      margin: auto;
      // transform: rotate(-30deg);
    }
    .cover-img {
      position: absolute;
      left: 0;
      right: 0;
      top: 150px;
      margin: auto;
      border-radius: 50%;
      width: 210px;
      height: 210px;
      // animation: rotate 10s linear infinite;
    }
    .border {
      position: absolute;
      left: 0;
      right: 0;
      top: 110px;
      margin: auto;
      width: 300px;
      height: 300px;
    }
  }
}
footer {
  width: 100%;
  .k-bar {
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 2.5vw;
    bottom: 11vh;
    // left: 7.5%;
    width: 95vw;
    .progress-bar {
      width: 80vw;
      display: flex;
    }
    span {
      color: white;
      font-size: 12px;
    }
  }
  .play-control {
    width: 85%;
    left: 7.5%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 2vh;
    .con {
      margin: auto;
      width: 26px;
      height: 26px;
    }
    .ppp {
      width: 54px;
      height: 54px;
    }
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
//控制条
.control-bar {
  margin: auto;
  width: 95%;
  height: 3px;
  background: -webkit-linear-gradient(
        rgba(250, 240, 230, 0.2),
        rgba(250, 240, 230, 0.2)
      )
      no-repeat,
    rgba(0, 0, 0, 0.2);
  position: relative;
  .progress {
    height: 100%;
    position: absolute;
    top: 0px;
    opacity: 0.6;
    display: inline-block;
    background-color: white;
  }
  .dragPoint {
    position: absolute;
    top: 0;
    left: -5px;
    bottom: 0;
    margin: auto;
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    z-index: 100;
    background-color: white;
    opacity: 1;
  }
}
</style>