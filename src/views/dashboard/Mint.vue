<template>
  <div class="row text-center mint-div">
    <div class="col">
      <div class="row">
        <div class="col">
          <img class="mint-logo" :src="'/static/like-to-do/mint.svg'" :alt="$t('token.name')"/>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="mint-tit">{{ $t("action.mint") }}</p>
          <p class="mint-txt">{{ $t("dashboard.mint.txt") }}}</p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p class="mint-input-tit">{{ $t("dashboard.mint.confirm") }}</p>
          <input type="text" v-model="synAmount" placeholder="0.00" class="mint-input">
        </div>
      </div>
      <div class="row">
        <div class="col-12 text-left notes-txt">
          {{ $t("dashboard.mint.staking") }} {{willLock}} {{ $t("token.name") }}
        </div>
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

    <loading :active.sync="loading"
             :can-cancel="false"
             :is-full-page="true"></loading>
  </div>
</template>

<script>
import skyrim from "../../utils/skyrim/skyrim";
import {syntheticAddr} from "../../utils/skyrim/constant";
import $ from "jquery";

// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

let opt = skyrim.opt
export default {
  name: "mint",
  components:{
    Loading
  },
  props: ["hideMint"],
  data() {
    return {
      synAmount: "0",
      enabled: false,
      willLock: "0",
      loading: false,
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
      opt.synToToken(syntheticAddr, this.synAmount)
        .then(r=>{
          this.willLock = r
        })
    }
  },

  mounted() {
    setTimeout(_=>{
      opt.syntheticEnabled(syntheticAddr)
              .then(r=>{
                if(r) {
                  this.enabled = true
                }
              })
              .catch(e=>{})
    }, 500)

  },

  methods: {
    async enableMint() {
      this.loading = true
      let enabled = await opt.syntheticEnabled(syntheticAddr)
      if(enabled) {
        this.enabled = true
        this.loading = false
        return
      }

      let _ = await opt.enableSynthetic(syntheticAddr)
      this.enabled = false
      this.loading = false
    },

    async mint() {
      let enabled = await opt.syntheticEnabled(syntheticAddr)
      if(!enabled) {
        this.enabled = false
        return
      }

      this.loading = true
      let validMint = await opt.hasEnoughToLock(syntheticAddr, this.synAmount)
      if(!validMint) {
        setTimeout(_=>{
          this.$notification.open({
            message: 'Invalid Mint!',
            description: this.$i18n.t("token.name") + " insufficient",
            duration: 0,
          });
          this.loading = false
        }, 400)

        return
      }

      let mintResult = await opt.mint(syntheticAddr, this.synAmount)

      if(mintResult !== null){
        console.log("mint transaction send success, tx hash is: ", mintResult)
      } else {
        //user cancel or other unknown things happened, do nothing
      }

      this.loading = false
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
