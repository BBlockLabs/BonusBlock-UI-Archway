<template>
  <box-wrapper class="twitter-box py-medium pl-large pr-medium">
    <div class="d-flex flex-row">
      <div class="mx-0 my-auto">
        <h3 style="line-height: 200%" class="pr-small fs-small m-0">
          <strong>Share the awesome news about joining Archway Network</strong>
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

  const message: string = `I have joined as a Blocktopian on @bonus_block! Visit ${referral} to start earning rewards for on-chain activity across Web3!`;

  const plainLink: string = `https://twitter.com/intent/tweet?text=${message}`;

  return encodeURI(plainLink);
});
</script>

<style scoped lang="scss"></style>
