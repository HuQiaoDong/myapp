<template>
  <div class="current-play-list">
    <header>
      <h3>当前播放{{`(${newSongsData.length})`}}</h3>
    </header>

    <ul class="playlist">
      <li v-for="(item,index) in newSongsData" :key="index">
        <div>
          <span>{{item.song.name}}</span>
          <span>-{{getArticleInfo(item)}}</span>
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
  props: ["newSongsData"],
  components: {
    // NewSongItem
  },
  methods: {
    getArticleInfo(songItem) {
      return songItem.song.artists.map(artist => artist.name).join("/");
    }
  }
};
</script>

<style lang="less" scoped>
.current-play-list {
  em {
    font-style: normal;
  }
  ul {
    height: 87%;
    scroll-behavior: auto;
    overflow-y: scroll;
    margin-top: 40px;
    li {
      display: flex;
      justify-content: space-between;
      height: 50px;
      line-height: 50px;
    }
  }
}
</style>