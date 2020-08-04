<template>
  <div class="container-fluid main-container">
    <wallet></wallet>
  </div>
</template>

<script>
import Wallet from "./Wallet";

export default {
  components: { Wallet }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main-container {
  height: 100%;
}
</style>
