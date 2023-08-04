<template>
  <SvgHome
    style="
      position: absolute;
      height: 100vh;
      max-width: 80vw;
      z-index: -1;
    "
  ></SvgHome>
  <el-main
    class="d-flex home-view px-extra-large flex-column"
  >
    <el-row justify="end">
      <el-col :span="-1">
        <svg-logo class="title-logo" />
      </el-col>
    </el-row>
    <el-row align="top" justify="space-between">
      <el-col :span="-1">
        <el-row>
          <el-col :span="-1" class="welcome-to-archway">
            <span style="">Welcome to </span>
            <br />
            <span class="archway-orange">Archway</span>
          </el-col>
        </el-row>
        <el-row class="fs-extra-large mt-large" style="line-height: 1.2em">
          <el-col>
            <span>Your value capture chain. Discover the Archway <br> Ecosystem with BonusBlock and earn <strong>$ARCH</strong></span>
          </el-col>
        </el-row>
        <el-row class="mt-large">
          <box-wrapper
            style="border-radius: 16px"
            type="white"
            round
            class="keplr-button pointer fs-large my-small p-small mr-small"
            @click="connectWallet('keplr')"
          >
            <el-row class="mx-medium is-align-middle" align="middle">
              <el-col class="d-flex" :span="-1">
                <svg-keplr class="mr-small icon-small" />
              </el-col>
              <el-col class="fs-base" :span="-1">
                <strong>Continue with Keplr</strong>
              </el-col>
            </el-row>
          </box-wrapper>

          <box-wrapper
            style="border-radius: 16px"
            type="white"
            round
            class="keplr-button pointer fs-large my-small p-small mr-small"
            @click="connectWallet('leap')"
          >
            <el-row class="mx-medium is-align-middle" align="middle">
              <el-col class="d-flex" :span="-1">
                <SvgLeapWallet class="mr-small icon-small w-auto" />
              </el-col>
              <el-col class="fs-base" :span="-1">
                <strong>Continue with Leap</strong>
              </el-col>
            </el-row>
          </box-wrapper>

          <box-wrapper
            style="border-radius: 16px"
            type="white"
            round
            class="keplr-button pointer fs-large my-small p-small mr-small"
            @click="connectWallet('cosmostation')"
          >
            <el-row class="mx-medium is-align-middle" align="middle">
              <el-col class="d-flex" :span="-1">
                <SvgCosmostation class="mr-small icon-small w-auto" />
              </el-col>
              <el-col class="fs-base" :span="-1">
                <strong>Continue with Cosmostation</strong>
              </el-col>
            </el-row>
          </box-wrapper>
        </el-row>
      </el-col>
    </el-row>
    <dialog-keplr v-model:open="keplrDialog" @connect="onKeplrLogin" />
  </el-main>
  <footer-component />
  <div id="cookie-consent"></div>
</template>

<script setup lang="ts">
import DialogKeplr from "@/components/KeplrDialog.vue";
import FooterComponent from "@/components/HomeFooter.vue";
import SvgLogo from "@/assets/archway/archway-logo.svg";
import SvgKeplr from "@/assets/icons/keplr.svg?component";
import SvgLeapWallet from "@/assets/icons/leap-wallet.svg?component";
import SvgCosmostation from "@/assets/icons/cosmostation.svg?component";
import SvgHome from "@/assets/archway/home-illustration.svg";
import type { Ref } from "vue";
import { ref } from "vue";
import { Router, useRoute, useRouter } from "vue-router";
import { StoreType, useStore } from "@/store";

import cookieConsentTools from "cookie-consent-tools";
import BoxWrapper from "@/components/BoxWrapper.vue";
import Chain from "@/common/Chain";
import LinkActionPayload from "@/common/LinkActionPayload";
import FormattedError from "@/common/errors/FormattedError";
import { ElMessageBox } from "element-plus";
import HttpUnauthorizedError from "@/common/errors/HttpUnauthorizedError";
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";

const store: StoreType = useStore();
const router: Router = useRouter();
const route = useRoute();

const keplrDialog: Ref<boolean> = ref(false);

setTimeout(() => {
  if (document.getElementById('cookie-consent') == null) {
    return;
  }
  cookieConsentTools.initialize({
    consentBox: {
      container: "cookie-consent",
      messages: {
        message:
          "We use Cookie3 Analytics for analytical and marketing purposes. " +
          "Cookie3 Analytics is a tool used to collect information about user behaviour " +
          "on the website. It is used to create a user profile. To learn more about the " +
          "processing of data by Cookie3 Analytics, please read the",
        seeMoreLabel: "Cookie3 Analytics Privacy Policy",
        okButton: "Got it",
      },
      seeMoreLink: {
        href: "https://app.cookie3.co/privacy",
        target: "_blank",
      },
    },
  });
}, 1000);

async function onKeplrLogin(): Promise<void> {
  keplrDialog.value = false;
  await router.push("/explore");
}

const connectWallet = async (wallet: "keplr" | "leap" | "cosmostation"): Promise<void> => {
  let chain = new Chain();
  let currentChain = ArchwayKeplrClient.getChain();
  let currentCurrency = ArchwayKeplrClient.getCurrency();

  chain.name = currentChain.chainName;
  chain.id = currentChain.chainId;
  chain.denom = currentCurrency.coinMinimalDenom;
  chain.source = "Keplr";
  chain.iconUrl = "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/chain.png";

  store.commit("setLoading", true);

  let dispatch: string;

  switch (wallet) {
    case "keplr":
      dispatch = 'UserModule/keplrLogin';
      break;
    case "leap":
      dispatch = 'UserModule/leapLogin';
      break;
    case "cosmostation":
      dispatch = 'UserModule/cosmostationLogin';
      break;
  }

  try {
    await store.dispatch(
      dispatch,
      new LinkActionPayload(
        chain,
        route.query.ref
          ? String(route.query.ref)
          : route.query.r
            ? String(route.query.r)
            : null
      )
    );
    keplrDialog.value = false;
    await router.push("/explore");
  } catch (error: any) {
    if (error instanceof FormattedError) {
      await ElMessageBox.alert(error.message, error.name, {});
    } else if (error instanceof HttpUnauthorizedError) {
      await store.dispatch("UserModule/removeSession");
      await router.push("/");
    } else {
      console.error(error);
      await ElMessageBox.alert(
        "There was an error connecting your wallet, please try again.",
        "Error",
        {
          center: true,
        }
      );
    }
  } finally {
    store.commit("setLoading", false);
  }
};

</script>

<style scoped lang="scss">
@use "@/design/theme.scss" as theme;
@use "element-plus/theme-chalk/src/mixins/function" as EPFunctions;
@use "element-plus/theme-chalk/src/mixins/mixins" as EPMixins;
@use "element-plus/theme-chalk/src/common/var" as EPVar;

.title-logo {
  height: 4.286em; // 60px
}

.title-text {
  font-size: 10.571em; // 148px
  font-family: "Nimbus Sans L", sans-serif;
  font-weight: 700;
  line-height: 120%;

  @media only screen and (max-width: 400px) {
    font-size: 8em;
  }
}

.keplr-button {
  padding: 1em 1.6em;
  box-shadow: 4px 24px 32px -4px rgba(0, 0, 0, 0.04);
}

.title-number {
  @extend .title-text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: black;
}

.fs-extra-large {
  @include EPMixins.res(xs, EPVar.$breakpoints) {
    font-size: 1.95em;
  }
}
</style>
