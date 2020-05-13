<template>
  <div id="app">
    <!-- <ul id="nav">
      <li><router-link to="/">推荐音乐</router-link></li>
      <li><router-link to="/hot">热歌榜</router-link></li>
      <li><router-link to="/search">搜索</router-link></li>
      一级路由出口
    </ul>-->
    <!-- <keep-alive> -->
    <router-view
      @tran-song-id="getCurrentSongUrl($event)"
      @tran-song-data="newSongsData=$event"
      :currentSongInfo="currentSongInfo"
    ></router-view>
    <!-- </keep-alive> -->

    <!-- 播放器 -->
    <BaseMusicControler
      v-if="currentSongUrl!=''"
      :songUrl="currentSongUrl"
      :songInfo="currentSongInfo"
      :newSongsData="newSongsData"
      :songIndex="songIndex"
      @trans-song-index="songIndex=$event"
    ></BaseMusicControler>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentSongInfo: "",
      currentSongUrl: "",
      newSongsData: [],
      songIndex: ""
    };
  },
  methods: {
    getCurrentSongUrl(params) {
      this.currentSongInfo = params;
      this.currentSongUrl = `https://music.163.com/song/media/outer/url?id=${params.id}.mp3`;
      console.log(this.currentSongUrl);
    }
  },
  mounted() {
    window.onload = function() {
      console.log("应用创建");
    };
  },
  created() {
    // console.log(this.currentSongId);
  },
  watch: {
    currentSongInfo: function(value) {
      console.log(this.currentSongInfo);
      
      if (value) {
        this.newSongsData.forEach((item, index)=> {
          if (this.currentSongInfo == item) {
            console.log(index);
            // this.currentSongInfo =
            this.songIndex = index;
          }
        });
      }
      console.log(value);
    },
    songIndex:function(value){
      this.getCurrentSongUrl(this.newSongsData[value]);
    }
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
  margin: 10px 0px 0px 0px;
  padding-bottom: 10px;
  display: flex;
  border-bottom: 1px solid #eeeeee;
  li {
    flex: 1;
    text-align: center;
  }
  a {
    padding: 0 3px;
    font-weight: normal;
    text-decoration: none;
    color: #333333;
    font-size: 15px;
    padding-bottom: 10px;

    // line-height: 40px;

    &.router-link-exact-active {
      color: #f03539;
      border-bottom: 2px solid #f03539;
    }
  }
}
</style>
