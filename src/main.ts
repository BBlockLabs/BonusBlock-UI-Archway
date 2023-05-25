import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { store, key } from "@/store";
import ElementPlus from "element-plus";
import type Chain from "@/common/Chain";
import VueCommonMixin from "@/common/Mixin";
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";

// ISO-8601, Europe
moment.updateLocale("en", {
  week: {
    dow: 1, // First day of week is Monday
    doy: 4, // First week of year must contain 4 January (7 + 1 - 4)
  },
});

import "@/design/index.scss";
import "@/../types/window.d.ts";
import "@/../types/svg.d.ts";
import "@/../types/typings.d.ts";
import "@/../types/identicons.d.ts";

const app = createApp(App);

app.mixin(VueCommonMixin);
app.use(router);
app.use(store, key);
app.use(ElementPlus);
app.use(VueApexCharts);
app.mount("#app");

const chains: Array<Chain> = JSON.parse(
  import.meta.env.VITE_PREDEFINED_CHAINS
) as Array<Chain>;

chains.forEach((chain: Chain): void => {
  store.commit("addChain", chain);
});
