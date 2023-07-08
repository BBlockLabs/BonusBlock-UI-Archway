<template>
  <box-wrapper class="twitter-box py-medium pl-large pr-medium">
    <div class="d-flex flex-row">
      <div class="mx-0 my-auto">
        <h3 style="font-weight: normal; text-align: center; line-height: 150%" class="archway-orange pr-small fs-small m-0">
          Spread the word about Archway's incentivized Mainnet missions on Twitter!
        </h3>
      </div>

      <a :href="link" target="_blank" class="my-auto">
        <SvgArchwayTwitter />
      </a>
    </div>
  </box-wrapper>
</template>

<script setup lang="ts">
import BoxWrapper from "@/components/BoxWrapper.vue";
import SvgArchwayTwitter from "@/assets/archway/archway-twitter.svg";
import type { ComputedRef } from "vue";
import { useStore, StoreType } from "@/store";
import { computed } from "vue";

const store: StoreType = useStore();

const link: ComputedRef<string> = computed((): string => {

  const referral: string = store.getters["UserModule/refLink"];

  const message: string = `@ArchwayHQ is kicking off their mainnet launch with a series of Incentivized Mainnet Missions on @bonus_block! Learn about the thriving Archway ecosystem and get rewarded for interacting with Archway dApps. ${referral}`;

  const plainLink: string = `https://twitter.com/intent/tweet?text=${message}`;

  return encodeURI(plainLink);
});
</script>

<style scoped lang="scss"></style>
