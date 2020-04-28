<template>
  <div id="app">
    <!-- <ul id="nav">
      <li><router-link to="/">推荐音乐</router-link></li>
      <li><router-link to="/hot">热歌榜</router-link></li>
      <li><router-link to="/search">搜索</router-link></li>
      一级路由出口
    </ul>-->
    <!-- <keep-alive> -->
      <router-view @tran-song-id="getCurrentSongUrl($event)"></router-view>
    <!-- </keep-alive> -->

    <!-- 播放器 -->
    <BaseMusicPlayer :songUrl="currentSongUrl" :songInfo="currentSongInfo"></BaseMusicPlayer>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentSongInfo:'',
      currentSongUrl: ""
    };
  },
  methods: {
    getCurrentSongUrl(params) {
      this.currentSongInfo = params;
      this.currentSongUrl = `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`
      console.log(this.currentSongUrl);
    }
  },
  created() {
    console.log(this.currentSongId);
  }
};
</script>
<style lang="less">
#app {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // // text-align: center;
  // color: #2c3e50;
}

#nav {
  padding: 30px 0px;
  display: flex;
  li {
    flex: 1;
    text-align: center;
  }
  a {
    font-weight: bold;
    text-decoration: none;
    color: #2c3e50;
    padding-bottom: 10px;

    // line-height: 40px;

    &.router-link-exact-active {
      color: #f03539;
      border-bottom: 2px solid #f03539;
    }
  }
}
</style>
