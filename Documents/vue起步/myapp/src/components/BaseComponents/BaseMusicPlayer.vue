<template>
  <div class="player">
    <div class="info-scope">
      <img :src="songInfo.picUrl" alt />
      <div class="songInfo">
        <h5 class="s-name">{{songInfo.song.name}}</h5>
        <span class="author">{{songInfo.song.artists[0].name}}</span>
      </div>
    </div>
    <div class="control">
      <canvas id="play-progress" width="25" height="25"></canvas>
      <i class="fa fa-play" aria-hidden="true"></i>
      <i class="fa fa-bars" aria-hidden="true"></i>
    </div>
          <audio :src="songUrl" controls style="height:36px;display:none"></audio>
  </div>

</template>

<script>
export default {
  // name: BaseMusicPlayer
  props: ["songUrl", "songInfo"],
  created() {
    console.log(this.songUrl);
    console.log(this.$el.audio);
  },
  mounted() {
    let audio = document.querySelector("audio");
    /** @type HTMLAudioElement */
    /** @type HTMLCanvasElement */
    console.log(audio);
    // audio.play();
    let canvas = document.querySelector("canvas");
    let context = canvas.getContext("2d");
    console.log(context);
    
    context.beginPath();
    context.lineWidth = 1.5;
    // context.moveTo(0,0);
    // context.lineTo(12.5,12.5);
    context.arc(12.5,12.5,12.5,0,2*Math.PI);
    context.stroke();
    context.closePath();
  }
};
</script>

<style lang="less" scoped>
.player {
  padding: 3px 0px;
  position: fixed;
  width: 100%;
  height: 40px;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #efefef;
  background-color: aqua;
  .info-scope {
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
    canvas{
      z-index: 999;
      position: absolute;
      top: 1px;
      left: -8px;
      border: 1px solid red;
    }
    // .fa-play{
    //   font-size: 5px;
    // }
    i{
      text-align: center;
      &:nth-child(2){
        padding: 4px 0px 0px 1px;
        font-size: 5px;
      }
      &:nth-child(3){
        font-size: 20px;
      }
    }
  }
}
</style>