import Vue from "vue";
import VueI18n from "vue-i18n";
import enLocale from "./en";
import zhLocale from "./zh";
import LangStorage from "./../utils/lang";

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  }
};

const i18n = new VueI18n({
  locale: LangStorage.getLang("en"),
  messages
});

export default i18n;
