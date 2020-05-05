<template>
  <div class="home">
    <div class="loading" v-if="showLoading">
      <img src="../assets/playing.svg" alt />
    </div>
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
    <div class="newsong" :class="[currentSongInfo ?'margin-bottom-40px':'']">
      <CardTitle class="card-title">最新音乐</CardTitle>
      <NewSongItem
        v-for="(item,index) in newsongs"
        :key="index"
        :item="item"
        :newsongs="newsongs"
        :currentSongInfo="currentSongInfo"
        @click.native="sendSongId(item,index,newsongs)"
        ref="childs"
      ></NewSongItem>
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
import NewSongItem from "@/components/NewSongItem";
export default {
  name: "Home",
  data() {
    return {
      showLoading: "",
      personalized: [],
      newsongs: [],
    };
  },
  props: ["currentSongInfo"],
  components: {
    CardTitle,
    SongListCard,
    NewSongItem
  },
  methods: {
    getPersonalized: function() {
      this.end = this.end + 6;
      console.log(this.end);

      this.axios
        .get("/personalized")
        .then(response => {
          console.log("缓存失效,Ajax重新获取歌单");

          let res = response.data.result;
          this.personalized = res;
          window.localStorage.setItem(
            "personalized",
            JSON.stringify({
              expire: Date.now() + 4.8 * 60 * 60 * 1000,
              result: response.data.result
            })
          );
          // this.personalized.push(res);
          // console.log(this.personalized);
          res.forEach((item, index) => {
            console.log("今日歌单", item.name, index);
          });
          this.updatePersonalizeds++;
        })
        .catch(error => {
          console.log(error);
        });
    },
    sendSongId(item, index,newSongsData) {
      console.log(item.id);
      this.$emit("tran-song-id", item);
      this.$emit("tran-song-data",newSongsData);
    },
    getNewSong() {
      this.axios
        .get("/personalized/newsong")
        .then(response => {
          // console.log(response);

          this.newsongs = response.data.result;
          window.localStorage.setItem(
            "newsong",
            JSON.stringify({
              expire: Date.now() + 4.8 * 60 * 60 * 1000,
              result: response.data.result
            })
          );
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
    console.log("Home被创建");
    // this.getPersonalized();
    const cachePersonalizeds = JSON.parse(
      window.localStorage.getItem("personalized")
    );
    if (cachePersonalizeds && cachePersonalizeds.expire > Date.now()) {
      this.personalized = cachePersonalizeds.result;
      console.log("从缓存中获取推荐歌单数据");
    } else {
      this.getPersonalized();
    }

    const cacheNewSong = JSON.parse(window.localStorage.getItem("newsong"));
    if (cacheNewSong && cacheNewSong.expire > Date.now()) {
      this.newsongs = cacheNewSong.result;
      console.log("从缓存中获取推荐音乐数据");
    } else {
      this.getNewSong();
    }
    // console.log(cachePersonalizeds);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showLoading = false;
    });
  },

  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(to, from, "即将离开home");
    this.showLoading = true;
    next();
  }
};
</script>
<style lang="less" scoped>
.personlized .personlized-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // flex: 1;
  .songlistcard {
    flex-basis: 32.8%;
    // flex-grow: 1;
  }
}
.margin-bottom-40px{
  margin-bottom: 40px;
}
.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  z-index: 999;
  justify-content: center;
  align-items: center;
  img{
    width: 36px;
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
.newsong {
  .card-title {
    margin-bottom: 15px;
  }
}
</style>
