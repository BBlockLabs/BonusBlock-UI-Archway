<template>
  <el-drawer
    :model-value="store.state.infoPanelOpen"
    direction="ltr"
    size="25.2857142857em"
    :append-to-body="true"
    modal-class="hidden-md-and-up"
    class="hidden-md-and-up page-wrapper-drawer"
    @closed="infoPanelClosed"
  >
    <template #header>
      <el-row justify="center">
        <el-col :span="-1">
          <h1 class="fs-extra-large m-0">Welcome</h1>
        </el-col>
      </el-row>
    </template>

    <template #default>
      <el-row justify="center" class="mb-base">
        <el-col>
          <id-card-front />
        </el-col>
      </el-row>

      <el-row justify="center" class="mt-auto">
        <el-col>
          <twitter-box />
        </el-col>
      </el-row>
    </template>

    <template #footer>
      <footer-component />
    </template>
  </el-drawer>

  <el-aside width="25.2857142857em" class="hidden-sm-and-down br-solid b-info">
    <el-container class="h-100" direction="vertical">
      <el-main class="d-flex flex-column gap-base">
        <el-row justify="center">
          <archway-logo style="height: 4em" />
        </el-row>
        <el-row justify="center" class="mb-base">
          <el-col>
            <id-card-front />
          </el-col>
        </el-row>

        <el-row justify="center" class="mt-auto">
          <el-col>
            <twitter-box />
          </el-col>
        </el-row>
      </el-main>

      <footer-component />
    </el-container>
  </el-aside>

  <el-container>
    <el-header class="p-0">
      <navigation-bar />
    </el-header>

    <el-main class="d-flex flex-column" :class="noPadding ? 'px-0 pt-0' : 'px-large pt-small'">
      <div style="margin-bottom: auto" id="page-wrapper" :class="fullWidth ? '' : 'limit-width'" :style="fullHeight ? 'height: 100%' : ''" v-bind="$attrs">
        <slot />
      </div>
      <el-footer class="mt-auto">
        <el-row align="bottom" justify="space-between">
          <el-col :span="-1">
            <el-row align="middle">
              <span>
                The ARCH tokens will not be offered in the United States or to
                persons or to residents of certain other prohibited jurisdictions.
              </span>
              <el-link
                :href="LinkDisclaimer"
                target="_blank"
                :underline="false"
                class="orange-link"
              >
                <span>Learn more.</span>
              </el-link>
            </el-row>

          </el-col>

          <el-col :span="-1">
            <el-row class="mb-medium" align="middle">
              <el-col class="mr-medium" :span="-1">
                <el-link
                  :href="LinkPrivacyPolicy"
                  target="_blank"
                  :underline="false"
                >
                  Privacy policy
                </el-link>
              </el-col>
              <el-col :span="-1">
                <el-link
                  :href="LinkDisclaimer"
                  target="_blank"
                  :underline="false"
                >
                  Terms of use
                </el-link>
              </el-col>
            </el-row>
            <el-row align="middle">
              <el-col :span="-1">
                <social-links
                  class="grey-socials"
                  :twitter="LinkTwitter"
                  :telegram="LinkTelegram"
                  :github="LinkGithub"
                  :discord="LinkDiscord"
                  :reddit="LinkReddit"
                />
              </el-col>
            </el-row>
          </el-col>
        </el-row>

      </el-footer>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import ArchwayLogo from "@/assets/logo/archway-logo.svg";
import FooterComponent from "@/components/PageFooter.vue";
import IdCardFront from "@/components/IdCardFront.vue";
import NavigationBar from "@/components/NavigationBar.vue";
import TwitterBox from "@/components/TwitterBox.vue";
import { StoreType, useStore } from "@/store";
import SocialLinks from "@/components/ExternalLinks.vue";

// 2023-07-27 - commented out since it causes an error on every page
// defineOptions({
//   inheritAttrs: false,
// });

const LinkTwitter: string = import.meta.env.VITE_LINK_TWITTER;
const LinkTelegram: string = import.meta.env.VITE_LINK_TELEGRAM;
const LinkGithub: string = import.meta.env.VITE_LINK_GITHUB;
const LinkDiscord: string = import.meta.env.VITE_LINK_DISCORD;
const LinkReddit: string = import.meta.env.VITE_LINK_REDDIT;
const LinkPrivacyPolicy: string = import.meta.env.VITE_LINK_PRIVACY_POLICY;
const LinkDisclaimer: string = import.meta.env.VITE_LINK_DISCLAIMER;

interface Props {
  cardBack?: boolean;
  fullHeight?: boolean;
  fullWidth?: boolean;
  noPadding?: boolean;
}

const props: Props = withDefaults(defineProps<Props>(), {
  cardBack: false,
  fullHeight: false,
});

function infoPanelClosed(): void {
  store.commit("closeInfoPanel");
}

const store: StoreType = useStore();
</script>

<style lang="scss">
.page-wrapper-drawer {
  .el-drawer__header {
    margin-bottom: 2rem;
  }

  .el-drawer__body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 0;
    padding-bottom: 1rem;
  }
}

.limit-width {
  max-width: 1800px;
  margin: auto;
  box-sizing: content-box;
}
</style>
