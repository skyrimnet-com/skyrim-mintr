<template>
  <div class="wallet-div">

    <div class="row">
      <div class="col text-left wallet-detail-tit">YOUR WALLET DETAILS:</div>
      <div class="col">
<!--        <input type="submit" class="btn btn-info btn-refresh" value="Refresh">-->
      </div>
    </div>

    <div class="row wallet-div ratio-div">
      <div class="col">
        <div class="row">
          <div class="col text-center txt-ratio-tit">{{mintingRate * 100}} %</div>
        </div>
        <div class="row">
          <div class="col text-center txt-ratio-txt">Target collateralization ratio</div>
        </div>
      </div>
    </div>

<!--    <div class="row fee-div">-->
<!--      <div class="col">-->
<!--        <img class="token-logo" :src="'/static/logo/sns-icon.png'" alt="SNS"/>-->
<!--        <span class="token-price">1 SNS = $0.05 USD</span>-->
<!--      </div>-->
<!--      <div class="col">-->
<!--        <img class="token-logo" :src="'/static/token/ETH.svg'" alt="ETH"/>-->
<!--        <span class="token-price">1 ETH = $356.42 USD</span>-->
<!--      </div>-->
<!--    </div>-->

    <div class="row total-token-div">
      <div class="col">
        <div class="row">
          <div class="col text-left token-price">TOTAL SNS:</div>
          <div class="col text-right token-price">{{totalSNS}} SNS</div>
        </div>
        <hr class="total-hr">
        <div class="row">
          <div class="col text-left lock-tran-txt">
            Locked: {{lockedSNS}}
          </div>
          <div class="col text-right lock-tran-txt">
            Transferable: {{snsBalance}}
          </div>
        </div>
        <div class="row">
          <div class="col lock-tran-color-1"></div>
          <div class="col lock-tran-color-2"></div>
        </div>
      </div>
    </div>

    <div class="row balance-list-div">
      <div class="col">
        <div class="row">
          <div class="col text-center token-price">BALANCE LIST</div>
        </div>
        <div class="row balance-item-1">
          <div class="col">
            <img class="balance-logo" :src="'/static/logo/sns-icon.png'" alt="SNS"/>
            SNS
          </div>
          <div class="col text-right">{{snsBalance}}</div>
<!--          <div class="col text-right">0 USD</div>-->
        </div>
        <div class="row balance-item-2">
          <div class="col">
            <img class="balance-logo" :src="'/static/token/ETH.svg'" alt="ETH"/>
            ETH
          </div>
          <div class="col text-right">{{ethBalance}}</div>
<!--          <div class="col text-right">0 USD</div>-->
        </div>
        <div class="row balance-item-1">
          <div class="col">
            <img class="balance-logo" :src="'/static/logo/sns-icon.png'" alt="SNS"/>
            sETH
          </div>
          <div class="col text-right">{{synBalance}}</div>
<!--          <div class="col text-right">0 USD</div>-->
        </div>
        <div class="row balance-item-2">
          <div class="col">
            <img class="balance-logo" :src="'/static/logo/sns-icon.png'" alt="SNS"/>
            Locked SNS
          </div>
          <div class="col text-right">{{lockedSNS}}</div>
<!--          <div class="col text-right">0 USD</div>-->
        </div>
      </div>
    </div>

    <div class="row go-to-uniswap-btn">
      <div class="col">
        <a
          class="go-to-uniswap-txt"
          href="https://app.uniswap.org/#/swap?inputCurrency=0x8e3c8e2de3cced6250b4ec129a82af4d2d3cbc5f" target="_blank"
        >GO TO UNISWAP</a
        >
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
  import Decimal from "decimal.js"
  // Import component
  import Loading from 'vue-loading-overlay';
  // Import stylesheet
  import 'vue-loading-overlay/dist/vue-loading.css';

  let opt = skyrim.opt
  let querying = false

  async function commonBalance(balanceFunc, addr) {
    return await balanceFunc(addr)
            .then(r=>{
              if(r === null) {
                return "0"
              }
              return r
            })
  }

  export default {
    name: "WalletDetails",

    components: {
      Loading
    },

    mounted() {
      setInterval(async _=>{
        if(querying) {
          return
        }

        querying = true

        this.snsBalance = await commonBalance(opt.snsBalance)
        this.ethBalance = await commonBalance(opt.ethBalance)
        this.mintingRate = await commonBalance(opt.currentMintingRate, syntheticAddr)
        this.synBalance = await commonBalance(opt.synAssetsBalance, syntheticAddr)
        this.lockedSNS = await commonBalance(opt.lockedSNSFor, syntheticAddr)

        this.loading = false
        querying = false
      }, 1000)
    },

    data() {
      return {
        mintingRate: "0",
        snsBalance: "0",
        ethBalance: "0",
        synBalance: "0",
        lockedSNS: "0",
        loading: true,
      }
    },

    computed: {
      totalSNS() {
        return new Decimal(this.snsBalance).add(this.lockedSNS).toDP(6, Decimal.ROUND_DOWN)
      }
    },

    methods: {
      // get
      async getRatio() {
        return opt.currentMintingRate(syntheticAddr)
      },

      async getBalance() {

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wallet-div,
.ratio-div,
.fee-div,
.total-token-div,
.balance-list-div {
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  border-radius: 5px;
  padding: 32px 24px;
}
.ratio-div,
.fee-div,
.total-token-div,
.balance-list-div {
  margin-top: 24px !important;
  padding: 24px 24px;
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
.btn-refresh {
  background-color: transparent;
  height: 40px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  font-size: 14px;
  cursor: pointer;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  padding: 2px 20px 0px;
  border-radius: 20px;
  transition: all 0.1s ease-in 0s;
  text-decoration: none;
  color: #c2c2de;
  float: right;
}
.txt-ratio-tit {
  font-size: 24px;
  color: rgb(194, 193, 225);
  line-height: 16px;
  letter-spacing: 1px;
  font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  font-weight: 500;
  margin: 0 0 8px;
}
.txt-ratio-txt {
  font-size: 18px;
}
.token-logo {
  height: 24px;
}
.token-price,
.lock-tran-txt {
  margin-left: 8px !important;
  font-size: 16px;
  font-family: apercu-medium, sans-serif;
  font-weight: bold;
  -webkit-box-align: center;
  align-items: center;
  color: rgb(194, 193, 225);
}
.total-hr {
  border-bottom: 1px solid rgb(38, 36, 57);
}
.lock-tran-txt {
  font-size: 14px;
}
.lock-tran-color-1 {
  margin-top: 8px !important;
  height:20px;
  background:rgba(104,101,163,1);
}
.lock-tran-color-2 {
  margin-top: 8px !important;
  height:20px;
  background:rgba(58,59,116,1);
}

.balance-item-1,
.balance-item-2 {
  margin-top: 8px !important;
  font-family: "apercu-regular", PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 14px;
  padding-top: 4px;
  padding-bottom: 4px;
}
.balance-item-1 {
  background-color: #1c1a27;
}
.balance-logo {
  height: 14px;
  margin-right: 4px;
}

.go-to-uniswap-btn {
  background-color: rgb(28, 26, 40);
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
  text-align: center;
  text-decoration: none;
  padding: 16px 20px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(38, 36, 57);
  border-image: initial;
  border-radius: 2px;
  margin-top: 24px !important;
}
.go-to-uniswap-txt {
  color: rgb(194, 193, 225);
}

</style>
