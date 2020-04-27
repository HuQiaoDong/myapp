<template>
  <div class="home">
    <BaseHomeLink></BaseHomeLink>
    <div class="personlized">
      <CardTitle class="card-title">推荐歌单</CardTitle>
      <div class="personlized-list">
        <SongListCard
          v-for="(item,index) in randomPersonlizeds()"
          :key="index"
          :item="item"
          class="songlistcard"
        ></SongListCard>
      </div>
    </div>
    <div class="newsong">
      <CardTitle class="card-title">最新音乐</CardTitle>
      <ul class="list">
        <li v-for="(song,index) in newsongs" :key="index" class="song-item">
          <span class="song-name">{{song.name}}</span>
          <span class="desc">{{song.song.alias[0]}}</span>
        </li>
      </ul>
    </div>
    <!-- .
    推荐音乐-->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
import CardTitle from "@/components/CardTitle.vue";
import SongListCard from "@/components/SongListCard";
export default {
  name: "Home",
  data() {
    return {
      personalized: [],
      newsongs: []
    };
  },
  components: {
    // HelloWorld
    CardTitle,
    SongListCard
  },
  methods: {
    getPersonalized: function() {
      this.axios
        .get("/personalized")
        .then(response => {
          let res = response.data.result;
          this.personalized = res;
          window.localStorage.setItem(
            "personalized",
            JSON.stringify({
              expire: Date.now() * 1 * 60 * 60 * 1000,
              result: response.data.result
            })
          );
          // this.personalized.push(res);
          // console.log(this.personalized);
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    getNewSong() {
      this.axios
        .get("/personalized/newsong")
        .then(response => {
          console.log(response);

          this.newsongs = response.data.result;
          window.localStorage.setItem(
            "newsong",
            JSON.stringify({
              expire: Date.now() * 1 * 60 * 60 * 1000,
              result: response.data.result
            })
          );
          // this.personalized.push(res);
          // console.log(this.personalized);
          console.log("歌单", this.newsongs);
        })
        .catch(error => {
          console.log(error);
        });
    },
    randomPersonlizeds: function() {
      return [...this.personalized].slice(0, 6);
      // var arr = [...this.personalized];
      // console.log(arr);

      // var newArr = [];
      // for (let i = 0; i < 6; i++) {
      //   var r = Math.floor(Math.random() * arr.length);
      //   console.log(r);
      //   // console.log(...arr.splice(r,1));
      //   newArr.push(...arr.splice(r, 1));
      // }
      // console.log(newArr);
      // return newArr;
    }
  },
  created() {
    this.getNewSong();
    // this.getPersonalized();
    const cachePersonalizeds = JSON.parse(
      window.localStorage.getItem("personalized")
    );
    if (cachePersonalizeds && cachePersonalizeds.expire > Date.now()) {
      this.personalized = cachePersonalizeds.result;
    } else {
      this.getPersonalized();
    }
    console.log(cachePersonalizeds);
  }
  // beforeCreate() {}
};
</script>
<style lang="less" scoped>
.personlized-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // flex: 1;
  .songlistcard {
    flex-basis: 32.8%;
    // flex-grow: 1;
  }
}

.card-title {
  border-left: 2px solid red;
  padding-left: 5px;
  height: 18px;
  font-weight: bold;
  line-height: 18px;
  margin-bottom: 15px;
}
.home {
  .newsong {
    .list {
      padding-left: 10px;
      .song-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 360px;
        span.song-name{
          font-size: 17px;
        }
        span.desc {
          margin-left: 5px;
          color: #888888;
        }
      }
    }
  }
}
</style>
