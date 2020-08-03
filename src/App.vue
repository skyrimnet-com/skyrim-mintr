<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view></router-view>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import TopNav from "./components/common/TopNav";
import FooterNav from "./components/common/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import skyrim from "./utils/skyrim/skyrim";
import {snsAddr} from "./utils/skyrim/constant";

export default {
  name: 'app',
  components: {
    FooterNav,
    TopNav
  },
  mounted() {
    skyrim.opt.load(snsAddr)
  }
}
</script>

<style>
html {
  height: 100%;
}
body {
  height: 100%;
  background-color: #0c0b17;
}
#app {
  font-family: 'FZQingKeBenYueSongS-R-GB', PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
}

/* container width set 1280px */
.container-fluid {
  padding-right: 0;
  padding-left: 0;
}
.row {
  max-width: 1280px;
  margin: 0 auto !important;
}

.swiper-pagination-bullet-active {
  background: #DFAF57 !important;
}
.swiper-pagination-bullet {
  width: 12px !important;
  height: 12px !important;
}
</style>
