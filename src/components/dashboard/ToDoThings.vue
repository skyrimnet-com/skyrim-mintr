<template>
  <div class="wallet-div">

    <div class="row">
      <div class="col wallet-detail-tit">What would you like to do?</div>
    </div>

    <div class="row text-center">
      <div class="col like-to-do-div">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/mint.svg'" alt="SNS"/>
        </div>
        <div class="like-to-do-tit">MINT</div>
        <div class="like-to-do-txt">Mint sETH by staking SNS</div>
      </div>
      <div class="col like-to-do-div">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/burn.svg'" alt="SNS"/>
        </div>
        <div class="like-to-do-tit">BURN</div>
        <div class="like-to-do-txt">Burn sETH to unlock staked SNS</div>
      </div>
    </div>

    <div class="row text-center">
      <div class="col like-to-do-div">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/transfer.svg'" alt="SNS"/>
        </div>
        <div class="like-to-do-tit">TRANSFER</div>
        <div class="like-to-do-txt">Transfer SNS, Synths, or ETH</div>
      </div>
      <div class="col like-to-do-div">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/track.svg'" alt="SNS"/>
        </div>
        <div class="like-to-do-tit">TRACK</div>
        <div class="like-to-do-txt">Track your debt over time</div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "ToDoThings"
}
</script>

<style scoped>
.wallet-div {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  border-radius: 5px;
  padding: 32px 24px;
}
.wallet-detail-tit {
  color: rgb(255, 255, 255);
  letter-spacing: 1px;
  font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 40px;
}
.like-to-do-div {
  cursor: pointer;
  height: 352px;
  max-width: 336px;
  background-color: rgb(28, 26, 40);
  box-shadow: rgba(18, 18, 43, 0.3) 0 5px 10px 5px;
  flex: 1 1 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  border-radius: 5px;
  transition: transform 0.2s ease-in 0s;
  margin: 8px !important;
  padding: 24px;
}
.like-to-do-logo {
  margin-top: 36px;
}
.like-to-do-tit {
  font-size: 24px;
  color: rgb(255, 255, 255);
  letter-spacing: 2px;
  font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  margin: 30px 0 20px !important;
}
.like-to-do-txt {
  font-size: 14px;
  color: rgb(255, 255, 255);
  letter-spacing: 2px;
  margin: 30px 0 20px !important;
}
</style>
