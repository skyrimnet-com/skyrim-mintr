<template>
  <div class="wallet-div">

    <div class="row">
      <div class="col wallet-detail-tit">{{ $t("dashboard.toDoThings.toDoName") }}</div>
    </div>

    <div class="row text-center" v-show="!toDoThingsViewDisabled">
      <div class="col like-to-do-div" @click="viewMint">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/mint.svg'" :alt="$t('token.name')"/>
        </div>
        <div class="like-to-do-tit">{{ $t("action.mint") }}</div>
        <div class="like-to-do-txt">{{ $t("dashboard.toDoThings.mint") }}</div>
      </div>
      <div class="col like-to-do-div" @click="viewBurn">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/burn.svg'" :alt="$t('token.name')"/>
        </div>
        <div class="like-to-do-tit">{{ $t("action.burn") }}</div>
        <div class="like-to-do-txt">{{ $t("dashboard.toDoThings.burn") }}</div>
      </div>
    </div>

    <div class="row text-center" v-show="!toDoThingsViewDisabled">
      <div class="col like-to-do-div" @click="comingSoon">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/transfer.svg'" :alt="$t('token.name')"/>
        </div>
        <div class="like-to-do-tit">{{ $t("action.transfer") }}</div>
        <div class="like-to-do-txt">{{ $t("dashboard.toDoThings.transfer") }}</div>
      </div>
      <div class="col like-to-do-div" @click="comingSoon">
        <div>
          <img class="like-to-do-logo" :src="'/static/like-to-do/track.svg'" :alt="$t('token.name')"/>
        </div>
        <div class="like-to-do-tit">{{ $t("action.track") }}</div>
        <div class="like-to-do-txt">{{ $t("dashboard.toDoThings.track") }}</div>
      </div>
    </div>

    <div class="row" v-show="toDoThingsViewDisabled">
      <div class="col">
        <input type="submit" class="btn btn-info btn-cancel" value="Cancel"
               @click="cancel"
        >
      </div>
    </div>

    <mint v-show="!mintDisabled" :hide-mint="cancel"></mint>

    <burn v-show="!burnDisabled" :hide-burn="cancel"></burn>

    <a-modal
        title=""
        :visible="visible"
        :closable="false"
        :centered="true"
        :cancel-button-props="{ props: { disabled: true } }"
        @ok="handleCancel"
    >
      <p>{{ comingSoonModalText }}</p>
    </a-modal>

  </div>
</template>

<script>
  import Mint from "./Mint"
  import Burn from "./Burn"
  import 'ant-design-vue/dist/antd.css';

  export default {
    name: "ToDoThings",
    data() {
      return {
        toDoThingsViewDisabled: false,
        mintDisabled: true,
        burnDisabled: true,
        comingSoonModalText: 'Coming Soon!',
        visible: false,
      }
    },
    methods: {
      handleCancel(e) {
        this.visible = false;
      },
      viewMint() {
        this.toDoThingsViewDisabled = true
        this.mintDisabled = false
      },
      viewBurn() {
        this.toDoThingsViewDisabled = true
        this.burnDisabled = false
      },
      cancel() {
        this.toDoThingsViewDisabled = false
        this.mintDisabled = true
        this.burnDisabled = true
      },
      comingSoon() {
        this.visible = true;
      }
    },
    components: { Mint, Burn }
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

.btn-cancel {
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
  padding: 2px 20px 0;
  border-radius: 20px;
  transition: all 0.1s ease-in 0s;
  text-decoration: none;
  color: #c2c2de;
  float: right;
}
</style>
