import Vue from "vue";
import Router from "vue-router";

const _import = file => () => import("@/views/" + file + ".vue");
Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "main",
    component: _import("main/index")
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: _import("dashboard/index")
  }
];

const router = new Router({
  mode: "history",
  routes: routes
});

export default router;
