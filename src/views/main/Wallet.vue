<template>
  <div class="wallet-container">
    <div class="row">
      <div class="col text-center welcome-tit">
        <div class="welcome-div">{{ $t("common.welcome") }}</div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="wallet-connect-div">
          <div class="row">
            <div class="col text-center wallet-connect-tit">
              Please connect a wallet with your SNS holdings to start:
            </div>
          </div>

          <div class="row">
            <div class="col d-flex justify-content-around">
              <button type="submit" class="wallet-btn" @click="openMetamask">
                <img class="wallet-btn-icon text-right" :src="'/static/wallet-btn/metamask.svg'" alt="Metamask"/>
                <h2 class="wallet-btn-name text-left">Metamask</h2>
              </button>
            </div>
          </div>

<!--          <div class="row">-->
<!--            <div class="col d-flex justify-content-around">-->
<!--              <button type="submit" class="wallet-btn" @click="openWalletConnect">-->
<!--                <img class="wallet-btn-icon" :src="'/static/wallet-btn/walletconnect.svg'" alt="WalletConnect"/>-->
<!--                <h2 class="wallet-btn-name">WalletConnect</h2>-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->
        </div>
      </div>
    </div>

    <a-modal
        title=""
        :visible="visible"
        :closable="false"
        :centered="true"
        :maskClosable="false"
        :ok-button-props="{ props: { disabled: true } }"
        @cancel="handleCancel"
    >
      <p>{{ ConnectWalletModalText }}</p>
    </a-modal>
  </div>
</template>

<script>
import skyrim from "../../utils/skyrim/skyrim";
import 'ant-design-vue/dist/antd.css';

export default {
  name: "Wallet",
  data() {
    return {
      ConnectWalletModalText: 'Waiting for connection',
      visible: false,
    };
  },
  methods: {
    handleCancel(e) {
      this.visible = false;
    },
    openMetamask() {
      //wallet connect
      this.visible = true;

      if(!skyrim.wallet.isConnected()) {
        skyrim.wallet.connect()
          .then(r=>{
            if(r === null) {
              //not connect, do nothing
              return
            }
            this.visible = false;
            this.$router.push({name: "Dashboard"})
          })
          .catch(()=>{
            //unknown error, do nothing
          })
      } else {
        //already connected
        this.visible = false;
        this.$router.push({name: "Dashboard"})
      }
    },
    openWalletConnect() {
      this.$router.push({name: "Dashboard"});
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.wallet-container {
  width: 100%;
  height: 100%;
  padding-top: 120px;
  padding-bottom: 120px;

  .welcome-tit {
    font-size: 32px;
    color: rgb(255, 255, 255);
    letter-spacing: 2px;
    font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
  }

  .welcome-div,
  .wallet-connect-div {
    border-width: 1px;
    border-style: solid;
    border-color: rgb(38, 36, 57);
    border-image: initial;
    border-radius: 5px;
    padding: 32px 24px;
    margin-bottom: 24px !important;
  }
  .wallet-connect-div {
    padding: 5% 10%;
  }

  .wallet-connect-tit {
    font-size: 20px;
    color: rgb(194, 193, 225);
    line-height: 28px;
    font-family: apercu-regular, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    margin: 10px 0 20px;
  }

  .wallet-btn {
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: left;
    -webkit-box-align: center;
    align-items: center;
    background-color: rgb(28, 26, 40);
    box-shadow: rgba(18, 18, 43, 0.3) 0 5px 10px 5px;
    opacity: 1;
    cursor: pointer;
    border-radius: 2px;
    padding: 16px 10%;
    margin: 10px 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(38, 36, 57);
    border-image: initial;
    transition: all 0.1s ease 0s;
  }
  .wallet-btn-name {
    margin: 0 0 0 16px;
    color: rgb(255, 255, 255);
    letter-spacing: 2px;
    font-family: apercu-medium, PingFang SC, 'Avenir', Helvetica, Arial, sans-serif;
    text-transform: capitalize;
    font-size: 18px;
  }
  .wallet-btn-icon {
    height: 40px;
    width: 40px;
  }
}
</style>
