<template>
  <ul class="list" @click="changeStatus">
    <li class="song-item">
      <div class="top">
        <div class="song-name">
          {{item.name}}
          <span class="desc">{{item.song.alias[0]}}</span>
        </div>
      </div>
      <p class="bottom">
        <i class="icon icon-quality"></i>
        <span>{{getArticleInfo(item)}}</span>
      </p>
    </li>
    <i :class="isPlay"></i>
  </ul>
</template>

<script>
export default {
  name: "NewSongItem",
  props: ["item","isplay"],
  data() {
    return {
      isPlay: {
        icon: true,
        "icon-play": true,
        fa: false,
        "fa-volume-up": false
      }
    };
  },
  methods: {
    // getArticleInfo(songItem) {
    //   let arr = [...songItem.song.artists];
    //   if (arr.length > 1) {
    //     let res = [];
    //     arr.forEach(function(item, index) {
    //       res.push(item.name);
    //       index;
    //     });
    //     return res.join("/") + "-" + songItem.song.album.name;
    //   } else {
    //     return songItem.song.artists[0].name + "-" + songItem.song.album.name;
    //   }
    // }
    getArticleInfo(songItem) {
      return (
        songItem.song.artists.map(artist => artist.name).join("/") +
        "-" +
        songItem.song.album.name
      );
    },
    changeStatus(){
      for(let i in this.isPlay){
        this.isPlay[i] = false;
      }
      this.isPlay["fa"] = true;
      this.isPlay["fa-volume-up"] = true;
    }
  }
};
</script>

<style lang="less" scoped>
.list {
  position: relative;
  padding-left: 10px;
  border-bottom: 1px solid #efefef;
  .fa {
    display: inline-block;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    // padding: 0 10px;
    &.fa-volume-up {
      color: red;
    }
  }
  .song-item {
    height: 55px;
    padding: 6px 0px;
    position: relative;

    .top {
      width: 350px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      .song-name {
        font-size: 17px;
        .desc {
          //   display: inline-block;
          margin-left: 5px;
          color: #888888;
        }
      }
    }

    .bottom {
      span {
        color: #888888;
        font-size: 12px;
      }
    }
  }
}
.icon {
  background-image: url("../assets/index_icon_2x.png");
  display: inline-block;
  background-size: 166px auto;

  &.icon-quality {
    width: 12px;
    height: 8px;
    margin: 0 5px 0 2px;
  }
  &.icon-play {
    width: 25px;
    height: 25px;
    background-position-x: -23px;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    padding: 0 10px;
  }
}
</style>