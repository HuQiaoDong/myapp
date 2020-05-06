<template>
  <div class="current-play-list">
    <header>
      <h3>当前播放{{`(${newSongsData.length})`}}</h3>
      <img src="../assets/random.svg" alt />
      <span>随机播放</span>
    </header>

    <ul class="playlist">
      <li v-for="(item,index) in newSongsData" :key="index">
        <div class="songInfo" @click="playIndex(item,newSongsData)">
          <span
            :class="currentSongInfo.id == item.id ? 'playing' : ''"
          >{{item.name || item.song.name|| item.al.name}}</span>
          <span :class="currentSongInfo.id == item.id ? 'playing' : ''">-{{getArticleInfo(item)}}</span>
        </div>

        <em>x</em>
      </li>
    </ul>
  </div>
</template>

<script>
// import NewSongItem from "../components/NewSongItem";
export default {
  name: "CurrentPlayList",
  props: ["newSongsData", "currentSongInfo"],
  data () {
    return {
        playList:this.newSongsData,
    }
  },
  components: {
    // NewSongItem
  },
  methods: {
    getArticleInfo(songItem) {
      if (songItem.song) {
        return songItem.song.artists.map(artist => artist.name).join("/");
      } else if(songItem.ar) {
        return songItem.ar.map(ar => ar.name).join("/");
      }
      else if(songItem.artists){
        return songItem.artists.map(artist => artist.name).join("/");
      }
    },
    playIndex(item,newSongsData){
      this.$emit('tran-song-id',item);
      // this.$emit('tran-song-id',item)
      console.log(newSongsData);
          
    }
  }
};
</script>

<style lang="less" scoped>
.current-play-list {
  z-index: 99999;
  position: fixed;
  width: 95%;
  left: 2.5%;
  bottom: 20px;
  height: 500px;
  border-radius: 20px;
  background-color: white;
  padding: 20px 20px 0px;

  header {
    h3{
      margin-bottom: 10px;
    }
    img {
      vertical-align: bottom;
    }
  }
  em {
    font-style: normal;
  }
  ul {
    height: 85%;
    scroll-behavior: auto;
    overflow-y: scroll;
    margin-top: 15px;
    li {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
      .songInfo {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 75vw;
        .playing {
          color: red !important;
        }
        span {
          &:nth-child(1) {
            font-size: 17px;
            color: #333333;
          }
          &:nth-child(2) {
            font-size: 12px;
            color: #888888;
          }
        }
      }
      em{
        font-size: 23px;
        color: #a7a7a7;
      }
    }
  }
}
</style>