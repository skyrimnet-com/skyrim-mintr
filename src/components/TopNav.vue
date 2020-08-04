<template>
  <nav
    class="navbar navbar-expand-md navbar-dark container"
  >
    <router-link class="navbar-brand" :to="{ path: '/' }">
      <img class="navbar-logo" :src="'/static/logo/top-nav-logo.png'" alt="SNS"/>
    </router-link>

    <!-- Toggler/collapsibe Button -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#snsNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links -->
    <div class="collapse navbar-collapse"  id="snsNavbar">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a
            class="scroll-bottom"
            href="https://t.me/Skyrimprotocol" target="_blank"
          >{{ $t("common.telegram") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="scroll-bottom"
            href="https://open.kakao.com/o/geb7pRmb" target="_blank"
          >{{ $t("common.kakaotalk") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="scroll-bottom"
            href="https://twitter.com/skyrimnet" target="_blank"
          >{{ $t("common.twitter") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="scroll-bottom"
            href="https://medium.com/@skyrimnetworkSNS" target="_blank"
          >{{ $t("common.medium") }}</a
          >
        </li>
        <li class="nav-item">
          <a
            class="scroll-bottom"
            href="https://uniswap.info/token/0x8e3c8e2de3cced6250b4ec129a82af4d2d3cbc5f" target="_blank"
          >{{ $t("common.uniswap") }}</a
          >
        </li>

        <li class="nav-item dropdown change-lang-btn">
          <a
            class="nav-link"
            href="#"
            id="navbardrop"
            data-toggle="dropdown"
          >
            <i class="fa fa-globe"></i>
            {{ $i18n.locale.toLocaleUpperCase() }}
          </a>
          <div class="dropdown-menu">
            <a class="dropdown-item" @click="$i18n.locale = 'en'">EN</a>
<!--            <a class="dropdown-item" @click="$i18n.locale = 'zh'">ZH</a>-->
          </div>
        </li>

      </ul>
    </div>
  </nav>
</template>

<script>
import $ from "jquery";

export default {
  name: "NavBar",
  methods: {
    scrollTo(targetId) {
      let $target = $("#" + targetId)
      $(window).scrollTop($target.offset().top)
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  max-width: 1280px;
  padding-top: 16px;
  padding-bottom: 16px;
}
.navbar-toggler {
  border: 0;
}
.navbar-logo {
  height: 28px;
}
.nav-item {
  margin: 12px 0;
}
.nav-link {
  padding: 0;
}
.nav-item > a,
.change-lang-btn > a {
  font-size: 17px;
  color: white !important;
}
.scroll-bottom {
  margin: 24px;
}
.scroll-bottom:hover {
  cursor: pointer;
}
.change-lang-btn {
  margin-left: 24px;
}
</style>
