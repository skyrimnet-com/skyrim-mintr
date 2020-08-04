import Vue from 'vue'
import router from "./router";
import Antd from 'ant-design-vue';
import App from './App.vue'
import "font-awesome/css/font-awesome.css";
import i18n from "./lang";
import VueCookies from "vue-cookies";
import Tools from "./utils/tools";

Vue.use(Antd);
Vue.use(Tools);
Vue.use(VueCookies);
Vue.use({
  i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
