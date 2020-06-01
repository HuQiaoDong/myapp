<template>
  <div class="search">
    <BaseHomeLink></BaseHomeLink>
    <div class="search-box">
      <i class="fa fa-search" aria-hidden="true"></i>
      <input type="text" v-model="keywords" placeholder="搜索歌曲、歌手、专辑" @click="searchSongsData=''" />
      <div class="delete">
        <i class="fa fa-times" aria-hidden="true" @click="keywords = ''" v-if="keywords"></i>
      </div>
    </div>
    <div class="data" v-show="!searchSongsData">
      <div>
        <div class="hot-search" v-if="!keywords">
          <h5>热门搜索</h5>
          <div class="tags">
            <span
              v-for="(hotTag,index) in hotSearch"
              :key="index"
              @click="getSongList(hotTag.first)"
            >{{hotTag.first}}</span>
          </div>
        </div>
        <h3 v-if="keywords">搜索{{`“${keywords}”`}}</h3>
        <ul class="search-suggestions" v-if="keywords">
          <li v-for="(item,index) in suggestions" :key="index" @click="getSongList(item.keyword)">
            <i class="fa fa-search" aria-hidden="true"></i>
            {{item.keyword}}
          </li>
        </ul>
        <!-- 这里写搜索历史记录 -->
        <ul class="search-history" v-if="!keywords">
          <li v-for="(item,index) in history" :key="index">
            <div class="time"></div>
            <img src="../assets/time.svg" alt class="clock" />
            <div class="history-info">
              <span @click="getSongList(item)">{{item}}</span>
              <img src="../assets/error.svg" alt @click="deleteHistoryMsg(item)" />
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 搜索出的歌单列表 -->
    <ul class="list" v-if="searchSongsData" :class="[currentSongInfo ?'margin-bottom-40px':'']">
      <li
        class="song-item"
        v-for="(item,index) in searchSongsData"
        :key="index"
        @click="play(item)"
      >
        <div class="top">
          <div class="song-name">
            {{item.name}}
            <span
              class="desc"
              :title="item.alias ? item.alias[0] :''"
            >{{item.alias ? item.alias[0] :''}}</span>
          </div>
        </div>
        <p class="bottom">
          <i class="icon icon-quality"></i>
          <span>{{getArticleInfo(item)}}</span>
        </p>
        <i :class="[currentSongInfo.id == item.id? playing : pause ]"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: "",
      suggestions: "",
      hotSearch: "",
      searchSongsData: "",

      // 是否正在搜索
      searching:false,

      playing: {
        fa: true,
        "fa-volume-up": true
      },
      pause: {
        icon: true,
        "icon-play": true
      },
      history: []
    };
  },
  props: ["currentSongInfo"],
  methods: {
    getAlbumCover(id){
      this.axios
        .get("/album", {
          params: {
            // code: "utf-8",
            id: id,
          }
        })
        .then(response => {
          this.$parent.currentSongInfo.album.artist.img1v1Url = response.data.songs[0].al.picUrl
          // return response.data.songs[0].al.picUrl
          console.log(this.$parent.currentSongInfo.album.artist.img1v1Url);
          
        })
        .catch(error => {
          console.log(error);
        });
    },
    getArticleInfo(songItem) {
      return (
        songItem.artists.map(artist => artist.name).join("/") +
        "-" +
        songItem.album.name
      );
    },
    play(item) {
      console.log("playitem ==> ", item);
      this.getAlbumCover(item.album.id);
      console.log(this.$parent.newSongsData);
      this.$parent.newSongsData.push(item);
      console.log(this.$parent.newSongsData);
      this.$emit("tran-song-id", item);
    },
    translateMsg(k) {
      // this.translateKeyword = k;
      this.axios
        .get("/search/suggest", {
          params: {
            // code: "utf-8",
            keywords: k,
            type: "mobile"
          }
        })
        .then(response => {
          this.searching = false;
          console.log(response);
          this.suggestions = response.data.result.allMatch;
          // this.suggests = response.data.result;
        })
        .catch(error => {
          console.log(error);
        });
      // console.log(this.suggests);
    },
    getSongList(songName) {
      this.loading = true;
      this.axios
        .get("/search", {
          params: {
            // code: "utf-8",
            keywords: songName
          }
        })
        .then(response => {
          console.log(response);
          this.searchSongsData = response.data.result.songs;
          this.loading = false;
          // this.suggests = response.data.result;
        })
        .catch(error => {
          console.log(error);
        });
      let flag = false;
      this.history.forEach(function(item, index) {
        index;
        if (item == songName) {
          flag = true;
        }
      });
      if (!flag) {
        this.history.push(songName);
      }
      window.localStorage.setItem("history", this.history);
    },
    deleteHistoryMsg(keyName) {
      this.history.forEach((item, index) => {
        if (item == keyName) {
          this.history.splice(index, 1);
        }
      });
      console.log(this.history);
      window.localStorage.setItem("history", this.history);
    }
  },
  created() {
    this.axios
      .get("/search/hot")
      .then(response => {
        console.log(response);
        this.hotSearch = response.data.result.hots;
        // this.suggests = response.data.result;
      })
      .catch(error => {
        console.log(error);
      });
    let h = window.localStorage.getItem("history");
    console.log(h);
    if (h) {
      let k = h.split(",");
      this.history = k;
    }
  },
  watch: {
    keywords: function(value) {
      this.searching = true;
      this.translateMsg(value);
    }
  }
};
</script>

<style lang="less" scoped>
.fa {
  &.fa-search {
    color: #acacac;
  }
}
.search {
  h3 {
    text-indent: 10px;
    color: #5873b1;
    padding: 15px 0px;
    border-bottom: 1px solid #f2f3f4;
  }
  .hot-search {
    padding: 0px 15px;
    h5 {
      padding: 10px 0px;
      color: #666666;
      font-size: 12px;
    }
    .tags {
      span {
        margin: 0px 5px 5px 0px;
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #e5e5e9;
        border-radius: 20px;
        color: #333333;
        font-size: 14px;
      }
    }
  }
  .search-suggestions {
    li {
      height: 45px;
      color: #333333;
      font-size: 15px;
      line-height: 45px;
      border-bottom: 1px solid #f2f3f4;
      padding-left: 8px;
    }
  }
  .search-history {
    margin-top: 20px;
    li {
      width: 100%;
      height: 45px;
      line-height: 45px;

      display: flex;
      img {
        padding: 4px;
        height: 45px;
        width: 35px;
        line-height: 45px;
        text-align: center;
        &.clock {
          padding: 8px;
          flex: 1;
        }
      }
      .history-info {
        border-bottom: 1px solid #efefef;
        width: 100%;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          color: #333333;
          flex: 9;
        }
      }
    }
  }
}
.search-box {
  display: flex;
  // margin: 0px 10px;
  border-bottom: 1px solid #ebecec;
  padding: 15px 10px;
  > i {
    line-height: 30px;
    text-align: center;
    width: 30px;
    height: 30px;
    font-size: 12px;
    background-color: #ebecec;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
  input {
    width: 290px;
    border: none;
    height: 30px;
    background-color: #ebecec;
    outline: none;
  }
  .delete {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #ebecec;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    i {
      padding-right: 5px;
      font-size: 16px;
      color: #acacac;
    }
  }
}

.list {
  li {
    border-bottom: 1px solid #efefef;
    position: relative;
    margin-left: 10px;
  }
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
      .song-name {
        color: #333333;
        width: 320px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-size: 17px;
        .desc {
          width: 260px;
          //   display: inline-block;
          margin-left: 5px;
          color: #888888;
        }
      }
    }

    .bottom {
      width: 80vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
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
.margin-bottom-40px {
  margin-bottom: 40px;
}
</style>