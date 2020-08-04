<template>
  <div class="row text-center mint-div">
    <div class="col">
      <div class="row">
        <div class="col">
          <img class="mint-logo" :src="'/static/like-to-do/mint.svg'" alt="SNS"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="mint-tit">MINT</p>
          <p class="mint-txt">Mint sETH by staking your SNS. This gives you a Collateralization Ratio and a debt, allowing you to earn staking rewards.</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="mint-input-tit">Confirm or enter amount to mint:</p>
          <input type="text" v-model="synAmount" placeholder="0.00" class="mint-input">
        </div>
      </div>
      <div class="row">
        <div class="col-6 text-left notes-txt">
          Staking: {{willLock}} SNX
        </div>
<!--        <div class="col-6 text-right notes-txt">-->
<!--          Estimated C-Ratio: NaN%-->
<!--        </div>-->
      </div>
      <div class="row">
        <div class="col">
          <p class="eth-fees-txt">&nbsp;</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <input v-show="enabled" type="submit" class="btn btn-info btn-mint-now" value="Mint Now"
                 @click="mint"
          >
          <input v-show="!enabled" type="submit" class="btn btn-info btn-mint-now" value="Enable Mint"
                 @click="enableMint"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import skyrim from "../../utils/skyrim/skyrim";
import {syntheticAddr} from "../../utils/skyrim/constant";

let opt = skyrim.opt
export default {
  name: "mint",
  props: ["hideMint"],
  data() {
    return {
      synAmount: "0",
      enabled: false,
      willLock: "0",
    }
  },

  watch: {
    enabled() {
      if(this.enabled) {
        $(this.$el).find(".mint-input").removeAttr("disabled")
      } else {
        $(this.$el).find(".mint-input").attr("disabled", "disabled")
      }
    },

    synAmount() {
      opt.synToSNS(syntheticAddr, this.synAmount)
        .then(r=>{
          this.willLock = r
        })
    }
  },

  mounted() {
    opt.syntheticEnabled(syntheticAddr)
    .then(r=>{
      if(r) {
        this.enabled = true
      }
    })
    .catch(e=>{})
  },

  methods: {
    async enableMint() {
      let enabled = await opt.syntheticEnabled(syntheticAddr)
      if(enabled) {
        this.enabled = true
        return
      }

      opt.enableSynthetic(syntheticAddr)
    },

    async mint() {
      let enabled = await opt.syntheticEnabled(syntheticAddr)
      if(!enabled) {
        this.enabled = false
        return
      }

      let validMint = await opt.hasEnoughToLock(syntheticAddr, this.synAmount)
      if(!validMint) {
        //todo: tell user dos not has enough SNS to lock
        return
      }

      let mintResult = await opt.mint(syntheticAddr, this.synAmount)
      if(mintResult !== null){
        console.log("mint transaction send success, tx hash is: ", mintResult)
      } else {
        //user cancel or other unknown things happened, do nothing
      }

      if(typeof this.hideMint === "function") {
        this.hideMint()
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.mint-div {
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

  .mint-logo {
    margin-top: 64px;
  }

  .mint-tit {
    font-size: 32px;
    color: rgb(255, 255, 255);
    letter-spacing: 2px;
    font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    margin: 42px 0px 12px;
  }
  .mint-txt,
  .mint-input-tit {
    font-size: 16px;
    color: rgb(194, 193, 225);
    font-family: apercu-regular, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: 400;
  }
  .mint-input-tit {
    margin-top: 48px;
  }
  .mint-input {
    width: 100%;
    height: 54px;
    background-color: rgb(28, 26, 40);
    font-size: 24px;
    color: rgb(255, 255, 255);
    padding: 16px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(38, 36, 57);
    border-image: initial;
    border-radius: 20px;
    outline: none;
    margin-bottom: 12px;
  }

  .notes-txt,
  .eth-fees-txt {
    font-size: 10px;
    color: rgb(148, 146, 196);
    line-height: 18px;
    letter-spacing: 0.5px;
    font-family: apercu-regular, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: 400;
  }
  .eth-fees-txt {
    margin-top: 32px;
  }

  .btn-mint-now {
    width: 100%;
    height: 72px;
    text-transform: uppercase;
    cursor: pointer;
    background-color: rgb(114, 124, 255);
    border-radius: 5px;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    transition: all 0.1s ease-in 0s;
  }
}
</style>
