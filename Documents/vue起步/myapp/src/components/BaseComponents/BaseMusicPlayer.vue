<template>
  <transition name="custom-classes-transition" leave-active-class="animated fadeOutDown">
    <div class="music-player">
      <div class="mask" :style="{backgroundImage: `url(${currentSong.picUrl})`}"></div>
      <div class="cover">
        <img src="../../assets/needle.png" alt="" class="needle">
        <img :src="currentSong.picUrl" alt class="cover-img" />
        <img src="../../assets/disc-ip6.png" alt class="border" />
      </div>
      <header>
        <i class="fa fa-arrow-left" aria-hidden="true" @click="closeWindow()"></i>
        <div class="song-info">
          <h3>{{currentSong.song.name}}</h3>
          <p>{{currentSong.song.artists[0].name}}</p>
        </div>
      </header>
      <footer>

      </footer>
    </div>
  </transition>
</template>

<script>
export default {
  mounted() {
    document.body.style.overflow = "hidden"; //禁止滚动
    // console.log(window.innerHeight, this.$el);
    console.log(this.currentSong.picUrl);

    this.$el.style.height = window.innerHeight + "px";
  },
  data() {
    return {
      //   show:this.show,
    };
  },
  props: ["currentSong","show"],
  methods: {
    closeWindow() {
      this.show = !this.show;
      this.$emit('close',this.show);
      // this.close = !close;
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
.music-player {
  position: fixed;
  top: 0;
  z-index: 9999;
  width: 100%;
  header {
    display: flex;
    color: #efefef;
    height: 50px;
    background-color: rgba(100, 100, 100, 0.2);
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
    .needle{
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
      animation: rotate 10s linear infinite;
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
</style>