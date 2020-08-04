<template>
  <div class="dashboard-container">
    <div class="row">
      <div class="col">
        <wallet-details></wallet-details>
      </div>
      <div class="col">
        <to-do-things></to-do-things>
      </div>
    </div>
  </div>
</template>

<script>
import WalletDetails from "./WalletDetails";
import ToDoThings from "./ToDoThings";

export default {
  name: "dashboard",
  components: { WalletDetails, ToDoThings }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
