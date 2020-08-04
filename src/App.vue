<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view></router-view>
    <footer-nav></footer-nav>
  </div>
</template>

<script>
import TopNav from "./components/TopNav";
import FooterNav from "./components/Footer";
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
  background-color: #0c0b17 !important;
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

/* ant design */
.ant-modal-content {
  background-color: rgb(28, 26, 40) !important;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  border-radius: 5px;
  transition: transform 0.2s ease-in 0s;
  color: rgb(194, 193, 225) !important;
  font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
}
.ant-modal-footer {
  border-top: 1px solid rgb(38, 36, 57) !important;
}
.ant-btn {
  background-color: transparent !important;
  height: 40px;
  font-size: 14px;
  cursor: pointer;
  border-width: 1px !important;
  border-style: solid !important;
  border-color: rgb(38, 36, 57) !important;
  border-image: initial !important;
  padding: 2px 20px 0;
  border-radius: 20px !important;
  transition: all 0.1s ease-in 0s !important;
  text-decoration: none !important;
  color: #c2c2de !important;
}
</style>
