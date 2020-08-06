<template>
  <div class="row text-center burn-div">
    <div class="col">
      <div class="row">
        <div class="col">
          <img class="burn-logo" :src="'/static/like-to-do/burn.svg'" alt="SNS"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="burn-tit">BURN</p>
          <p class="burn-txt">Burn sETH to unlock your staked SNS. This increases your Collateralization Ratio and reduces your debt, allowing you to transfer your non-escrowed SNS.</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="burn-input-tix">Confirm or enter amount to burn:</p>
          <input type="text" v-model="burnAmount" placeholder="0.00" class="burn-input">
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-left notes-txt">
          Unlock: {{willUnlock}} SNX
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
          <input type="submit" class="btn btn-info btn-burn-now" value="Burn Now"
                 @click="burn"
          >
        </div>
      </div>
    </div>

    <loading :active.sync="loading"
             :can-cancel="false"
             :is-full-page="true"></loading>
  </div>
</template>

<script>
import skyrim from "../../utils/skyrim/skyrim";
import {syntheticAddr} from "../../utils/skyrim/constant";
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

let opt = skyrim.opt
export default {
  name: "Burn",
  props: ["hideBurn"],

  components: {
    Loading
  },

  data(){
    return {
      burnAmount: "0",
      willUnlock: "0",
      loading: false,
    }
  },

  watch: {
    burnAmount() {
      opt.synToSNS(syntheticAddr, this.burnAmount)
      .then(r=>{
        this.willUnlock = r
      })
    }
  },

  methods: {
    async burn() {
      let snsAmount = await opt.synToSNS(syntheticAddr, this.burnAmount)

      this.loading = true
      let validUnlock = await opt.verifyUnlock(syntheticAddr, snsAmount)
      if(true !== validUnlock) {
        this.loading = false
        this.$notification.open({
          message: 'Invalid Burn!',
          description: validUnlock,
          duration: 0,
        });
        return
      }

      let unlockResult = await opt.redeem(syntheticAddr, snsAmount)
      if(unlockResult !== null){
        console.log("mint transaction send success, tx hash is: ", unlockResult)
      } else {
        //user cancel or other unknown things happened, do nothing
      }

      this.loading = false
      if(typeof this.hideBurn === "function") {
        this.hideBurn()
      }
    }
  },
}
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.burn-div {
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

  .burn-logo {
    margin-top: 64px;
  }

  .burn-tit {
    font-size: 32px;
    color: rgb(255, 255, 255);
    letter-spacing: 2px;
    font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    margin: 42px 0px 12px;
  }
  .burn-txt,
  .burn-input-tix {
    font-size: 16px;
    color: rgb(194, 193, 225);
    font-family: apercu-regular, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    font-weight: 400;
  }
  .burn-input-tix {
    margin-top: 48px;
  }
  .burn-input {
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

  .btn-burn-now {
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
