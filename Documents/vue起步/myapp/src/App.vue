<template>
  <div id="app">
    <!-- <ul id="nav">
      <li><router-link to="/">推荐音乐</router-link></li>
      <li><router-link to="/hot">热歌榜</router-link></li>
      <li><router-link to="/search">搜索</router-link></li>
      一级路由出口
    </ul>-->
    <router-view />
    <!-- 播放器 -->
    <!-- <audio src="" controls style="height:36px"></audio> -->

  </div>
</template>

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
