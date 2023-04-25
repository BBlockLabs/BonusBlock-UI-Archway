import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import { store, key } from "@/store";
import ElementPlus from "element-plus";
import type Chain from "@/common/Chain";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTwitter,
  faTelegram,
  faReddit,
  faDiscord,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import "@/design/index.scss";
import "@/../types/window.d.ts";
import "@/../types/svg.d.ts";
import "@/../types/typings.d.ts";
import "@/../types/identicons.d.ts";

library.add(faTwitter, faTelegram, faReddit, faDiscord, faYoutube);

const app = createApp(App);

app.use(router);
app.use(store, key);
app.use(ElementPlus);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.mount("#app");

const chains: Array<Chain> = JSON.parse(
  import.meta.env.VITE_PREDEFINED_CHAINS
) as Array<Chain>;

chains.forEach((chain: Chain): void => {
  store.commit("addChain", chain);
});
