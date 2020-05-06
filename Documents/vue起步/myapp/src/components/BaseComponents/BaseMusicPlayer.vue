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
        <div class="lyric" v-if="lyric" @click="lyric=!lyric">
          <ul>
            <li v-for="(row,index) in parsedLyric" :key="index">{{row.text}}</li>
          </ul>
        </div>
      </transition>
      <footer></footer>
    </div>
  </transition>
</template>

<script>
export default {
  mounted() {
    document.body.style.overflow = "hidden"; //禁止滚动
    // console.log(window.innerHeight, this.$el)
    this.$el.style.height = window.innerHeight + "px";
  },
  data() {
    return {
      //   show:this.show,
      playerShow: "",
      lyric: false,
      currentLyric: ""
    };
  },
  props: ["currentSong", "show", "imgUrl", "songName", "songAuthor", "isPlay"],
  methods: {
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
            return {
              time: Number(m) * 60 + Number(s) + Number(n),
              text: item.substr(11) || "---------"
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
  created() {
    this.getLyric();
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
  z-index: 2000;
  width: 100%;
  .lyric {
    color: #cacacc;
    position: relative;
    z-index: 8888;
    height: 70vh;
    border: 1px solid red;
    background-color: rgba(100, 100, 100, 0.8);
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
    position: fixed;
    top: 0;
    filter: blur(30px) brightness(0.5);
    transform: scale(2);
    width: inherit;
    height: inherit;
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