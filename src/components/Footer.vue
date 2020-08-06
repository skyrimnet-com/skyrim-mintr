<template>
  <div class="footer-background">
    <div class="row">
      <div class="col text-center">
        {{$t("footer.copyRight")}}
      </div>
    </div>
  </div>
</template>

<script>
	import $ from "jquery";

	export default {
		name: "Footer",
		methods: {
			scrollTo(targetId) {
				let $target = $("#" + targetId)
				$(window).scrollTop($target.offset().top)
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.footer-background {
  color: white;
  padding: 60px 0;

  .footer-logo {
    height: 32px;
  }
  .footer-col {
    margin: 24px 0;
  }
}
</style>
