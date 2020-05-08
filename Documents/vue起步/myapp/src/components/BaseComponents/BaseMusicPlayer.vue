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
              <span id="progress" class="progress"></span>
              <span id="dragPoint" class="dragPoint"></span>
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
      <footer></footer>
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
      playerShow: "",
      lyric: false,
      currentLyric: null,
      currentLyricIndex: ""
    };
  },
  props: ["currentSong", "show", "imgUrl", "songName", "songAuthor", "isPlay"],
  methods: {
    // dragBar: function(el, progress) {
    //   el.addEventListener("touchstart", function(e) {
    //     let ev = e || window.event;

    //     el.addEventListener("touchmove", function(e) {
    //       let ev = e || window.event;
    //       let touch = ev.targetTouches[0];
    //       e.preventDefault();
    //       // that.audio.muted = true;
    //       // let bili = this.site.offsetWidth / 100;
    //       // this.dragPoint.style.left = time - this.dragPoint.offsetWidth / 2 + 'px';
    //     });
    //     el.addEventListener("touchend", function(e) {
    //       let ev = e || window.event;
    //       e.preventDefault();
    //       // that.audio.muted = false;
    //     });
    //   });
    // },
    controlVolume(){
      let audio = document.querySelector('audio');
      if(audio){
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
    }
  },
  mounted() {
    document.body.style.overflow = "hidden"; //禁止滚动

    let audio = this.$parent.$el.querySelector("audio");

    this.$el.style.height = "100vh";
    console.log("kk", audio);
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

.rotate {
  transform: rotate(0deg);
  animation: rotate 10s linear infinite;
  animation-play-state: paused;
  &.active {
    animation-play-state: running;
  }
}
</style>